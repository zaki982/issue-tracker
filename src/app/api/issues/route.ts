import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Issue, Priority, Status, IssueType, User } from '@prisma/client';

type CreateIssueData = {
  title: string;
  description: string;
  stepsToReproduce?: string;
  priority: Priority;
  severity: Severity;
  type: IssueType;
  product?: string;
  version?: string;
  assigneeId?: number;
};

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100);
    const skip = (page - 1) * pageSize;
    
    // Sorting
    const sortField = searchParams.get('sort') || 'createdAt';
    const sortOrder = searchParams.get('order') || 'desc';
    
    // Filters
    const filters: any = {};
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status');
    }
    
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority');
    }
    
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type');
    }
    
    if (searchParams.get('assignee')) {
      filters.assigneeId = parseInt(searchParams.get('assignee')!);
    }
    
    if (searchParams.get('reporter')) {
      filters.reporterId = parseInt(searchParams.get('reporter')!);
    }
    
    // Search
    const search = searchParams.get('search');
    const searchFilters = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
    
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Build the where clause
    const where = {
      ...searchFilters,
      ...(Object.keys(filters).length ? filters : {}),
    };
    
    // Get total count for pagination
    const total = await prisma.issue.count({ where });
    
    // Get issues with related data
    const issues = await prisma.issue.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip,
      take: pageSize,
    });
    
    return NextResponse.json({
      issues,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
    
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data: CreateIssueData = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.priority || !data.severity || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the current user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create the new issue
    const newIssue = await prisma.issue.create({
      data: {
        title: data.title,
        description: data.description,
        stepsToReproduce: data.stepsToReproduce || null,
        priority: data.priority,
        severity: data.severity,
        type: data.type,
        product: data.product || null,
        version: data.version || null,
        status: Status.OPEN,
        reporter: {
          connect: { id: user.id },
        },
        ...(data.assigneeId && {
          assignee: {
            connect: { id: data.assigneeId },
          },
        }),
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignee: data.assigneeId ? {
          select: {
            id: true,
            name: true,
            email: true,
          },
        } : false,
      },
    });
    
    // Add to issue history
    await prisma.issueHistory.create({
      data: {
        issueId: newIssue.id,
        changedById: user.id,
        fromStatus: Status.OPEN, // First status
        toStatus: Status.OPEN,   // Same as first status
        note: 'Issue created',
      },
    });
    
    return NextResponse.json(newIssue, { status: 201 });
    
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    );
  }
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBug, FaUser, FaSignInAlt, FaSignOutAlt, FaUserCog, FaPlus } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'Issues', href: '/issues' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/signin');
      toast({
        title: 'Signed out successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error signing out',
        description: 'There was an error signing out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isMounted) {
    return (
      <nav className="flex items-center justify-between p-4 border-b h-16">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            <FaBug className="h-6 w-6" />
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between p-4 border-b h-16">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-bold">
          <FaBug className="h-6 w-6" />
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {status === 'authenticated' ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-1"
              onClick={() => router.push('/issues/new')}
            >
              <FaPlus className="h-3 w-3" />
              <span>New Issue</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={session.user?.image || ''} 
                      alt={session.user?.name || 'User'}
                    />
                    <AvatarFallback>
                      {session.user?.name ? (
                        session.user.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()
                      ) : (
                        <FaUser className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <FaUserCog className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <FaSignOutAlt className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/auth/signin')}
              className="flex items-center gap-1"
            >
              <FaSignInAlt className="h-3 w-3" />
              <span>Sign In</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/auth/signup')}
              className="hidden sm:flex items-center gap-1"
            >
              <span>Sign Up</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
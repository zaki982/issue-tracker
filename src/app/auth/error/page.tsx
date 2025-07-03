'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const errorMessages: Record<string, string> = {
    'OAuthAccountNotLinked': 'This email is already associated with another account. Please sign in with the original provider.',
    'CredentialsSignin': 'Invalid email or password. Please try again.',
    'AccessDenied': 'You do not have permission to sign in.',
    'Default': 'An error occurred during sign in. Please try again.',
  };
  
  const errorMessage = error ? (errorMessages[error] || errorMessages['Default']) : errorMessages['Default'];
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>
        
        <div className="mt-6">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

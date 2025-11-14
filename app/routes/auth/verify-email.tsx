import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, Loader, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVerifyEmailMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';


const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      mutate({ token }, {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || 'An error occurred while verifying email';
          setIsSuccess(false);
          console.error('Error verifying email:', errorMessage);
          toast.error(errorMessage);
        }
      });
    }
  }, [searchParams, mutate]);
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-muted/90'>
      <h1 className='text-2xl font-bold'>Verify Email</h1>
      <p className='text-sm text-gray-500'>Verifying your email...</p>

      <Card className='w-full max-w-md mt-5'>
        <CardContent>
          <div className='flex flex-col items-center justify-center gap-1 py-6'>
            {isVerifying ? (
              <>
                <Loader className='w-10 h-10 text-gray-500 animate-spin' />
                <h3 className='text-lg font-semibold text-gray-500'>Verifying email...</h3>
                <p className='text-sm text-gray-500'>Please wait while we verify your email.</p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className='w-10 h-10 text-green-500' />
                <h3 className='text-lg font-semibold text-green-500'>Email verified successfully</h3>
                <p className='text-sm text-gray-500'>You can now sign in with your email.</p>

                <Link to='/sign-in' className='mt-6'>
                  <Button variant={`outline`}>Back to Sign In</Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className='w-10 h-10 text-red-500' />
                <h3 className='text-lg font-semibold text-red-500'>Invalid token</h3>
                <p className='text-sm text-gray-500'>Please try again with a valid token.</p>

                <Link to='/sign-in' className='mt-6'>
                  <Button variant={`outline`}>Back to Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail
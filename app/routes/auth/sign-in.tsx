import { signInSchema } from '@/lib/schema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { useLoginMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { useAuth } from '@/provider/auth-context'
import { Loader2 } from 'lucide-react'
import { createPageMeta } from '@/lib/meta'

export const meta = () =>
  createPageMeta("Sign In", "Sign in to TaskMan to manage projects and tasks.");

type SignInFormData = z.infer<typeof signInSchema>

const SignIn = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation();

  const handleOnSubmit = (values: SignInFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        login(data);
        toast.success("Sign in successful");
        navigate("/workspaces");
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
        console.log(error);
      },
    });
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-muted/40'>
      <Card className='w-full max-w-md shadow-xl py-6 px-2'>
        <CardHeader className='text-center pb-6'>
          <CardTitle className='text-3xl font-semibold'>Welcome back</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='Enter your email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link to='/forgot-password' className='text-sm text-blue-600'>Forgot password?</Link>
                    </div>
                    <FormControl>
                      <Input type='password' placeholder='Enter your password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full h-10' disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className='animate-spin inline-block w-4 h-4 mr-2' />
                    <span className='text-sm'>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className='text-sm'>Sign In</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex items-center justify-center'>
          <CardDescription className='text-sm'>
            Don't have an account?&nbsp;
            <Link to='/sign-up' className='font-semibold text-blue-700 hover:underline'>Sign up</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
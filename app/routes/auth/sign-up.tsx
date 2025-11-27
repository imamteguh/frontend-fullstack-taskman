import { signUpSchema } from '@/lib/schema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { useSignUpMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createPageMeta } from '@/lib/meta'

export const meta = () =>
  createPageMeta("Sign Up", "Create your TaskMan account and start organizing work.");

export type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = () => {

  const navigate = useNavigate();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Email Verification Required", {
          description: "Please verify your email address to continue, check your inbox for the verification email.",
        });

        form.reset();
        navigate("/sign-in");
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "Failed to create account";
        console.log(error)
        toast.error(errorMessage);
      },
    });
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-muted/40'>
      <Card className='w-full max-w-md shadow-xl py-6 px-2'>
        <CardHeader className='text-center pb-6'>
          <CardTitle className='text-3xl font-semibold'>Create an Account</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='Jhon Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='example@example.com' {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full h-10' disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className='animate-spin inline-block w-4 h-4 mr-2' />
                    <span className='text-sm'>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span className='text-sm'>Create Account</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex items-center justify-center'>
          <CardDescription className='text-sm'>
            Already have an account?&nbsp;
            <Link to='/sign-in' className='font-semibold text-blue-700 hover:underline'>Sign in</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp
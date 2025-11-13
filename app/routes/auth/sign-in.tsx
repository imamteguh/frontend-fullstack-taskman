import { signInSchema } from '@/lib/schema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

type SignInFormData = z.infer<typeof signInSchema>

const SignIn = () => {

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = (values: SignInFormData) => {
    console.log(values)
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-muted/40'>
      <Card className='w-full max-w-md shadow-xl p-4'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Welcome Back</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>Sign in your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-6'>
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
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link to='/forgot-password' className='text-sm text-blue-600'>Forgot password?</Link>
                    </div>
                    <FormControl>
                      <Input type='password' placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>Sign In</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex items-center justify-center pb-4'>
          <CardDescription className='text-sm text-muted-foreground'>
            Don't have an account?&nbsp;
            <Link to='/sign-up' className='text-primary'>Sign Up</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
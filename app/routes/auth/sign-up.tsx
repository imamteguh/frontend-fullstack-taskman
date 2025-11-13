import { signUpSchema } from '@/lib/schema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = () => {

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const handleOnSubmit = (values: SignUpFormData) => {
    console.log(values)
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-muted/40'>
      <Card className='w-full max-w-md shadow-xl p-4'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Create an Account</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>Sign up to create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-6'>
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
                      <Input type='password' placeholder='********' {...field} />
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
                      <Input type='password' placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>Sign Up</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex items-center justify-center pb-4'>
          <CardDescription className='text-sm text-muted-foreground'>
            Already have an account?&nbsp;
            <Link to='/sign-in' className='text-primary'>Sign In</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignUp
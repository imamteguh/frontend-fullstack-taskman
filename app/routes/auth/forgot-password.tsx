import { forgotPasswordSchema } from '@/lib/schema'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { ArrowLeft, CheckCircle, Loader, Loader2 } from 'lucide-react'
import { Link } from 'react-router'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForgotPasswordMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {

  const [isSuccess, setIsSuccess] = useState(false)

  const { mutate, isPending } = useForgotPasswordMutation()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data, {
      onSuccess: (data) => {
        console.log(data)
        toast.success("Password reset email sent")
        setIsSuccess(true)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
        console.log(error);
      },
    })
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-3xl font-semibold'>Forgot Password</h1>
          <p className='text-sm text-gray-600'>Enter your email below to reset your password</p>
        </div>
        <Card>
          <CardHeader>
            <Link to={`/sign-in`} className='flex items-center gap-2 text-muted-foreground hover:text-primary'>
              <ArrowLeft className='w-4 h-4' />
              <span className='text-sm'>Back to login</span>
            </Link>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className='flex flex-col items-center justify-center'>
                <CheckCircle className='w-12 h-12 text-green-500' />
                <h3 className='text-lg font-bold'>Password reset email sent</h3>
                <p className='text-sm text-gray-600'>Please check your email to reset your password</p>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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

                    <Button type='submit' className='w-full h-10' disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className='animate-spin inline-block w-4 h-4 mr-2' />
                          <span className='text-sm'>Sending Reset Link...</span>
                        </>
                      ) : (
                        <>
                          <span className='text-sm'>Send Reset Link</span>
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
          <CardFooter className='flex items-center justify-center pb-4'>
            <CardDescription className='text-sm'>
              Remembered your password?&nbsp;
              <Link to='/sign-in' className='font-semibold text-blue-700 hover:underline'>Login</Link>
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword
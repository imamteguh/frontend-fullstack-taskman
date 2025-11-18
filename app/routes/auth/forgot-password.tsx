import { forgotPasswordSchema } from '@/lib/schema'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
          <h1 className='text-2xl font-bold'>Forgot Password</h1>
          <p className='text-sm text-gray-600'>Enter your email below to reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <Link to={`/sign-in`} className='flex items-center gap-2'>
              <ArrowLeft className='w-6 h-6' />
              <span>Back to Sign In</span>
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
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type='email' placeholder='example@example.com' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type='submit' className='w-full' disabled={isPending}>
                      {isPending ? (
                        <Loader2 className='w-6 h-6 animate-spin' />
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword
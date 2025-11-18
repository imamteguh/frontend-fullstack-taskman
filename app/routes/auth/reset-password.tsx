import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useResetPasswordMutation } from '@/hooks/use-auth'
import { resetPasswordSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { data, Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'


export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {

  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const [isSuccess, setIsSuccess] = useState(false)

  const { mutate, isPending } = useResetPasswordMutation()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid or missing token")
      return
    }

    mutate({
      token: token as string,
      ...values,
    }, {
      onSuccess: () => {
        setIsSuccess(true)
        toast.success("Password reset successful")
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "An error occurred"
        toast.error(errorMessage)
        console.log(error)
      },
    })
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-2xl font-bold'>Reset Password</h1>
          <p className='text-sm text-gray-600'>Enter your new password below</p>
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
                <h3 className='text-lg font-bold'>Password reset successful</h3>
                <p className='text-sm text-gray-600'>You can now sign in with your new password</p>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="New Password"
                            />
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
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Confirm New Password"
                            />
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

export default ResetPassword
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authAPI } from '@/services/api';

const resetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
});

export function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email and new password to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: '', newPassword: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              try {
                await authAPI.resetPassword(values.email, values.newPassword);
                toast.success('Password reset successfully');
              } catch (error: any) {
                toast.error(error.response?.data?.message || error.message || 'Failed to reset password');
                setFieldError('email', error.message);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email && touched.email}
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Field
                    as={Input}
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    error={errors.newPassword && touched.newPassword}
                  />
                  {errors.newPassword && touched.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>

                <div className="text-center text-sm">
                  Remember your password?{' '}
                  <Link to="/auth/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}

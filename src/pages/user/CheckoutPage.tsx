import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { ordersAPI } from '@/services/api';
import { clearCart } from '@/features/cart/cartSlice';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const checkoutSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  zipCode: Yup.string().required('Zip code is required'),
  phone: Yup.string().required('Phone number is required'),
});

export function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAuth();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                address: '',
                city: '',
                zipCode: '',
                phone: '',
                notes: '',
              }}
              validationSchema={checkoutSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  // Validate that all cart items have valid product IDs
                  const invalidItems = items.filter(item => !item.product || !item.product.id);
                  if (invalidItems.length > 0) {
                    toast.error('Some items in your cart are invalid. Please refresh and try again.');
                    return;
                  }

                  await ordersAPI.create(items, values);
                  dispatch(clearCart());
                  toast.success('Order placed successfully!');
                  navigate('/');
                } catch (error: any) {
                  const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
                  toast.error(errorMessage);
                  console.error('Order creation error:', error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Field
                      as={Input}
                      id="address"
                      name="address"
                      error={errors.address && touched.address}
                    />
                    {errors.address && touched.address && (
                      <p className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Field
                      as={Input}
                      id="city"
                      name="city"
                      error={errors.city && touched.city}
                    />
                    {errors.city && touched.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Field
                      as={Input}
                      id="zipCode"
                      name="zipCode"
                      error={errors.zipCode && touched.zipCode}
                    />
                    {errors.zipCode && touched.zipCode && (
                      <p className="text-sm text-destructive">{errors.zipCode}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Field
                      as={Input}
                      id="phone"
                      name="phone"
                      type="tel"
                      error={errors.phone && touched.phone}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Field
                      as={Textarea}
                      id="notes"
                      name="notes"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ${item.product.salePrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.product.salePrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

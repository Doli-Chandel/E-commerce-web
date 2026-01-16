import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { Product } from '@/types';

const productSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  purchasePrice: Yup.number().min(0, 'Price must be positive').required('Purchase price is required'),
  salePrice: Yup.number()
    .min(0, 'Price must be positive')
    .required('Sale price is required')
    .test('greater-than-purchase', 'Sale price must be greater than purchase price', function (value) {
      const purchasePrice = this.parent.purchasePrice;
      return !purchasePrice || !value || value > purchasePrice;
    }),
  stock: Yup.number().min(0, 'Stock must be non-negative').required('Stock is required'),
  isVisible: Yup.boolean(),
  image: Yup.string()
    .url('Must be a valid URL')
    .test('is-http-url', 'URL must start with http:// or https://', function (value) {
      if (!value) return true; // Optional field
      return value.startsWith('http://') || value.startsWith('https://');
    })
    .optional(),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const initialValues = product
    ? {
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        stock: product.stock,
        isVisible: product.isVisible,
        image: product.images && product.images.length > 0 ? product.images[0] : '', // Use first image URL
      }
    : {
        name: '',
        description: '',
        purchasePrice: 0,
        salePrice: 0,
        stock: 0,
        isVisible: true,
        image: '', // Image URL
      };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={productSchema}
      onSubmit={(values, { setSubmitting }) => {
        const submitData: any = {
          name: values.name,
          description: values.description,
          purchasePrice: values.purchasePrice,
          salePrice: values.salePrice,
          stock: values.stock,
          isVisible: values.isVisible,
        };

        // If image URL is provided, send it
        if (values.image) {
          submitData.image = values.image;
        }

        onSubmit(submitData);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched, values, setFieldValue }) => {
        const margin = values.salePrice - values.purchasePrice;
        return (
          <Form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Field
                as={Input}
                id="name"
                name="name"
                error={errors.name && touched.name}
              />
              {errors.name && touched.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Field
                as={Textarea}
                id="description"
                name="description"
                rows={3}
                error={errors.description && touched.description}
              />
              {errors.description && touched.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Field
                  as={Input}
                  id="purchasePrice"
                  name="purchasePrice"
                  type="number"
                  step="0.01"
                  error={errors.purchasePrice && touched.purchasePrice}
                />
                {errors.purchasePrice && touched.purchasePrice && (
                  <p className="text-sm text-destructive">{errors.purchasePrice}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Field
                  as={Input}
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  error={errors.salePrice && touched.salePrice}
                />
                {errors.salePrice && touched.salePrice && (
                  <p className="text-sm text-destructive">{errors.salePrice}</p>
                )}
              </div>
            </div>

            {values.purchasePrice > 0 && values.salePrice > 0 && (
              <div className="p-2 bg-muted rounded">
                <Label>Margin: ₹ {margin.toFixed(2)}</Label>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Field
                as={Input}
                id="stock"
                name="stock"
                type="number"
                error={errors.stock && touched.stock}
              />
              {errors.stock && touched.stock && (
                <p className="text-sm text-destructive">{errors.stock}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Field
                as={Input}
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                error={errors.image && touched.image}
              />
              {errors.image && touched.image && (
                <p className="text-sm text-destructive">{errors.image}</p>
              )}
              {values.image && (
                <div className="mt-2">
                  <img
                    src={values.image}
                    alt="Preview"
                    className="max-w-xs max-h-48 object-contain border rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={values.isVisible}
                onCheckedChange={(checked) => setFieldValue('isVisible', checked)}
              />
              <Label htmlFor="isVisible">Visible</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

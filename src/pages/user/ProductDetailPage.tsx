import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch } from '@/app/hooks';
import { productsAPI } from '@/services/api';
import { addToCart } from '@/features/cart/cartSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        console.log('Product data:', data);
        if (data && data.salePrice !== undefined) {
          setProduct(data);
        } else {
          console.error('Invalid product data:', data);
          toast.error('Invalid product data received');
          navigate('/products');
        }
      } catch (error: any) {
        console.error('Error loading product:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    dispatch(addToCart({ product, quantity }));
    toast.success('Product added to cart');
  };

  if (loading || !product) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate('/products')} className="mb-4">
        ← Back to Products
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">No image</span>
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">
                  ₹ {product.salePrice ? product.salePrice.toFixed(2) : '0.00'}
                </p>
                {product.stock === 0 && (
                  <Badge variant="destructive" className="mt-2">
                    Out of Stock
                  </Badge>
                )}
                {product.stock > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.stock} items in stock
                  </p>
                )}
              </div>

              {product.stock > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.max(1, Math.min(val, product.stock)));
                      }}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

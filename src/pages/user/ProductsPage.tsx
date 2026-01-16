import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { productsAPI } from '@/services/api';
import { addToCart } from '@/features/cart/cartSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error: any) {
        console.error('Error loading products:', error);
        setProducts([]);
        toast.error(error.response?.data?.message || error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Product added to cart');
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No products available</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-muted-foreground">No image</span>
                  )}
                </div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">₹ {product.salePrice.toFixed(2)}</p>
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="mt-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ordersAPI } from '@/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll();
      setOrders(data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async (id: string) => {
    try {
      await ordersAPI.proceed(id);
      toast.success('Order proceeded successfully');
      loadOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to proceed order');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await ordersAPI.cancel(id);
      toast.success('Order cancelled successfully');
      loadOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      PENDING: 'secondary',
      PROCEEDED: 'default',
      CANCELLED: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.user.name}</div>
                        <div className="text-sm text-muted-foreground">{order.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.orderItems.length} item(s)</TableCell>
                    <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleProceed(order.id)}
                            >
                              Proceed
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancel(order.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === 'PROCEEDED' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancel(order.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

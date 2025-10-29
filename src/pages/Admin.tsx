import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Eye, 
  Download, 
  Trash2, 
  Calendar,
  MapPin,
  Home,
  FileText,
  Image,
  LogOut
} from 'lucide-react';
import { apiClient, OrdersListParams } from '@/utils/apiClient';
import { authManager } from '@/utils/authManager';
import AdminOrderDetail from '@/components/AdminOrderDetail';

interface Order {
  id: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  property_type: string;
  build_year: string;
  note: string;
  created_at: string;
  updated_at: string;
  upload_count: number;
  text_count: number;
  paid?: boolean;
  paid_at?: string;
  payment_status?: string;
  payment_amount?: number;
  stripe_payment_intent_id?: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [user, setUser] = useState(authManager.getUser());
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [paidFilter, setPaidFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Check authentication on mount
  useEffect(() => {
    if (!authManager.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    setUser(authManager.getUser());
    
    // Verify token and get CSRF token
    apiClient.verifyToken().then(() => {
      loadOrders();
    });
  }, [navigate]);

  const handleLogout = async () => {
    await apiClient.logout();
    navigate('/admin/login');
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: OrdersListParams = {
        page: currentPage,
        limit: 20,
        search: search || undefined,
        propertyType: propertyType || undefined,
        city: city || undefined,
        paid: paidFilter || undefined,
        sortBy,
        sortOrder,
      };

      const response = await apiClient.fetchOrders(params);
      
      if (response.success) {
        setOrders(response.orders);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } else {
        setError(response.error || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Reload orders when filters change
  useEffect(() => {
    if (authManager.isAuthenticated()) {
      loadOrders();
    }
  }, [currentPage, search, propertyType, city, paidFilter, sortBy, sortOrder]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiClient.deleteOrder(orderId);
      if (response.success) {
        await loadOrders(); // Reload the list
      } else {
        alert('Failed to delete order: ' + response.error);
      }
    } catch (err) {
      alert('Network error while deleting order');
      console.error('Error deleting order:', err);
    }
  };

  const handleExportOrder = async (orderId: string) => {
    try {
      await apiClient.exportOrder(orderId);
    } catch (err) {
      alert('Failed to export order');
      console.error('Error exporting order:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (order: Order) => {
    const parts = [order.street, order.house_number, order.postal_code, order.city];
    return parts.filter(Boolean).join(' ');
  };

  if (showDetail && selectedOrder) {
    return (
      <AdminOrderDetail 
        order={selectedOrder}
        onBack={() => setShowDetail(false)}
        onDelete={() => {
          setShowDetail(false);
          handleDeleteOrder(selectedOrder.id);
        }}
        onExport={() => handleExportOrder(selectedOrder.id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage all orders and customer data</p>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  Logged in as: <span className="font-medium">{user.username}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Page</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Photos</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(o => o.upload_count > 0).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Texts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(o => o.text_count > 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={propertyType || "all"} onValueChange={(value) => setPropertyType(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Einfamilienhaus">Einfamilienhaus</SelectItem>
                  <SelectItem value="Reihenhaus">Reihenhaus</SelectItem>
                  <SelectItem value="Bungalow">Bungalow</SelectItem>
                  <SelectItem value="Mehrfamilienhaus">Mehrfamilienhaus</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <Select value={paidFilter || "all"} onValueChange={(value) => setPaidFilter(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="true">Paid</SelectItem>
                  <SelectItem value="false">Unpaid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Newest First</SelectItem>
                  <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  <SelectItem value="city-asc">City A-Z</SelectItem>
                  <SelectItem value="city-desc">City Z-A</SelectItem>
                  <SelectItem value="street-asc">Address A-Z</SelectItem>
                  <SelectItem value="street-desc">Address Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadOrders}>Retry</Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Property Type</TableHead>
                        <TableHead>Build Year</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{formatAddress(order)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-gray-400" />
                              <span>{order.property_type || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>{order.build_year || 'N/A'}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <Badge variant={order.upload_count > 0 ? 'default' : 'secondary'}>
                                  {order.upload_count} photos
                                </Badge>
                                <Badge variant={order.text_count > 0 ? 'default' : 'secondary'}>
                                  {order.text_count} texts
                                </Badge>
                              </div>
                              {order.paid !== undefined && (
                                <Badge 
                                  variant={order.paid ? 'default' : 'secondary'}
                                  className={order.paid ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}
                                >
                                  {order.paid ? 'Paid' : 'Unpaid'}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExportOrder(order.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {orders.length} of {total} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  MapPin, 
  Home, 
  Calendar, 
  FileText, 
  Image,
  Save,
  Edit3,
  CreditCard,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

// Mapping for descriptive area names for alt text
const areaNames: Record<string, string> = {
  keller: 'Keller',
  elektro: 'Elektroinstallation',
  heizung: 'Heizung',
  fassade: 'Fassade',
  dach: 'Dach',
  innenraeume: 'Innenräume'
};

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
  stripe_checkout_session_id?: string;
}

interface OrderDetail {
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
  paid?: boolean;
  paid_at?: string;
  payment_status?: string;
  payment_amount?: number;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
  uploads: Array<{
    id: string;
    order_id: string;
    area: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    created_at: string;
  }>;
  texts: Array<{
    id: string;
    order_id: string;
    area: string;
    content: string;
    created_at: string;
    updated_at: string;
  }>;
}

interface AdminOrderDetailProps {
  order: Order;
  onBack: () => void;
  onDelete: () => void;
  onExport: () => void;
}

const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({
  order,
  onBack,
  onDelete,
  onExport,
}) => {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    loadOrderDetail();
  }, [order.id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getOrderDetails(order.id);
      
      if (response.success) {
        setOrderDetail(response.order);
        setAdminNote(response.order.note || '');
      } else {
        setError(response.error || 'Failed to load order details');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error loading order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    try {
      setSavingNote(true);
      const response = await apiClient.updateOrderNote(order.id, { note: adminNote });
      
      if (response.success) {
        setIsEditingNote(false);
        if (orderDetail) {
          setOrderDetail({ ...orderDetail, note: adminNote });
        }
      } else {
        alert('Failed to save note: ' + response.error);
      }
    } catch (err) {
      alert('Network error while saving note');
      console.error('Error saving note:', err);
    } finally {
      setSavingNote(false);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPublicImageUrl = (upload: any) => {
    // Use the publicUrl from backend if available, otherwise fallback to constructing it
    return upload.publicUrl || `https://claverum-bucket.s3.eu-north-1.amazonaws.com/${upload.file_path}`;
  };

  const groupUploadsByArea = () => {
    if (!orderDetail) return {};
    
    return orderDetail.uploads.reduce((acc, upload) => {
      if (!acc[upload.area]) {
        acc[upload.area] = [];
      }
      acc[upload.area].push(upload);
      return acc;
    }, {} as Record<string, typeof orderDetail.uploads>);
  };

  const groupTextsByArea = () => {
    if (!orderDetail) return {};
    
    return orderDetail.texts.reduce((acc, text) => {
      acc[text.area] = text;
      return acc;
    }, {} as Record<string, typeof orderDetail.texts[0]>);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
              <Button onClick={onBack}>Back to Orders</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const uploadsByArea = groupUploadsByArea();
  const textsByArea = groupTextsByArea();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600 font-mono text-sm">{orderDetail.id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export ZIP
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {[orderDetail.street, orderDetail.house_number, orderDetail.postal_code, orderDetail.city]
                        .filter(Boolean)
                        .join(' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Property Type</label>
                  <p className="mt-1">{orderDetail.property_type || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Build Year</label>
                  <p className="mt-1">{orderDetail.build_year || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(orderDetail.created_at)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(orderDetail.updated_at)}</span>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                    {!isEditingNote && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingNote(true)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditingNote ? (
                    <div className="space-y-2">
                      <Textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add admin notes..."
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveNote}
                          disabled={savingNote}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {savingNote ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditingNote(false);
                            setAdminNote(orderDetail.note || '');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {adminNote || 'No admin notes'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            {(orderDetail.paid !== undefined || orderDetail.payment_status) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {orderDetail.paid ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-yellow-500" />
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Unpaid</Badge>
                        </>
                      )}
                      {orderDetail.payment_status && (
                        <span className="text-sm text-gray-500 capitalize">
                          ({orderDetail.payment_status})
                        </span>
                      )}
                    </div>
                  </div>

                  {orderDetail.paid && orderDetail.paid_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Paid At</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(orderDetail.paid_at)}</span>
                      </div>
                    </div>
                  )}

                  {orderDetail.payment_amount && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Amount</label>
                      <p className="mt-1 font-semibold">{(orderDetail.payment_amount / 100).toFixed(2)}€</p>
                    </div>
                  )}

                  {orderDetail.stripe_payment_intent_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Payment Intent ID</label>
                      <p className="mt-1 font-mono text-xs break-all">{orderDetail.stripe_payment_intent_id}</p>
                    </div>
                  )}

                  {orderDetail.stripe_checkout_session_id && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Checkout Session ID</label>
                      <p className="mt-1 font-mono text-xs break-all">{orderDetail.stripe_checkout_session_id}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Photos and Texts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos by Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Photos ({orderDetail.uploads.length} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(uploadsByArea).length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No photos uploaded</p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(uploadsByArea).map(([area, uploads]) => (
                      <div key={area}>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Badge variant="secondary">{area}</Badge>
                          <span className="text-sm text-gray-600">({uploads.length} photos)</span>
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {uploads.map((upload) => (
                            <div key={upload.id} className="relative group">
                              <img
                                src={getPublicImageUrl(upload)}
                                alt={`Bauschadensanalyse - ${areaNames[area] || area} Bereich - Gebäudeaufnahme`}
                                className="w-full h-32 object-cover rounded-lg border"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="text-white text-xs text-center">
                                  <p>{formatFileSize(upload.file_size)}</p>
                                  <p>{formatDate(upload.created_at)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Texts by Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Area Descriptions ({orderDetail.texts.length} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(textsByArea).length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No area descriptions provided</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(textsByArea).map(([area, text]) => (
                      <div key={area} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{area}</Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(text.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{text.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;



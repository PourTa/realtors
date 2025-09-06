import React, { useState, useEffect } from 'react';
import { Package, User, FileText, Calendar, DollarSign, Eye, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  assets: Array<{
    name: string;
    type: string;
  }>;
  notes: string;
  total: number;
  timestamp: string;
  status: 'pending' | 'in-review' | 'approved' | 'in-production' | 'completed';
}

const ManufacturingDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-review' | 'approved' | 'in-production' | 'completed'>('all');

  // Mock data - in real implementation, this would come from your backend
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderId: 'PO-1704067200000',
        client: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@remax.com',
          phone: '(555) 123-4567',
          company: 'RE/MAX Premier',
          address: '123 Main St',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701'
        },
        items: [
          { id: 'custom-mug', name: 'Custom Branded Coffee Mug', price: 24.99, quantity: 50 },
          { id: 'coffee-sachet', name: 'Branded Coffee Sachets (Pack of 10)', price: 34.99, quantity: 25 }
        ],
        assets: [
          { name: 'remax-logo.png', type: 'image/png' },
          { name: 'brand-guidelines.pdf', type: 'application/pdf' }
        ],
        notes: 'Please use the blue RE/MAX colors. Need these for a client appreciation event on March 15th.',
        total: 2124.25,
        timestamp: '2025-01-01T10:00:00Z',
        status: 'pending'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in-production': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'in-production': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pour Ta Manufacturing</h1>
                <p className="text-sm text-gray-600">Order Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  {orders.length} Total Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Purchase Orders</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Orders' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'in-review', label: 'In Review' },
                  { key: 'approved', label: 'Approved' },
                  { key: 'in-production', label: 'In Production' },
                  { key: 'completed', label: 'Completed' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderId}</h3>
                      <p className="text-gray-600">{order.client.firstName} {order.client.lastName} - {order.client.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Items:</span>
                      <p className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} units</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Assets:</span>
                      <p className="font-medium">{order.assets.length} files</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="font-medium">{new Date(order.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">No orders match the current filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {selectedOrder ? (
              <>
                {/* Client Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Client Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <p className="font-medium">{selectedOrder.client.firstName} {selectedOrder.client.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Company:</span>
                      <p className="font-medium">{selectedOrder.client.company}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedOrder.client.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-medium">{selectedOrder.client.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <p className="font-medium">
                        {selectedOrder.client.address}<br />
                        {selectedOrder.client.city}, {selectedOrder.client.state} {selectedOrder.client.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assets */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Design Assets
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.assets.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{asset.name}</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Special Instructions</h3>
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Status Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Update Status</h3>
                  <div className="space-y-2">
                    {[
                      { status: 'in-review', label: 'Mark as In Review' },
                      { status: 'approved', label: 'Approve Order' },
                      { status: 'in-production', label: 'Start Production' },
                      { status: 'completed', label: 'Mark Complete' }
                    ].map(({ status, label }) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status as Order['status'])}
                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium text-gray-700"
                        disabled={selectedOrder.status === status}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Order</h3>
                <p className="text-gray-600">Click on an order from the list to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingDashboard;
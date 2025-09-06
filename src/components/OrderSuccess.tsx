import React from 'react';
import { Check } from 'lucide-react';
import { OrderItem, UploadedAsset } from '../types';

interface OrderSuccessProps {
  cart: OrderItem[];
  uploadedAssets: UploadedAsset[];
  calculateTotal: () => number;
  onPlaceAnotherOrder: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({
  cart,
  uploadedAssets,
  calculateTotal,
  onPlaceAnotherOrder
}) => {
  return (
    <div className="text-center space-y-8">
      <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
        <Check className="w-12 h-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Thank you for your order! Your information and assets have been sent to our Pour Ta Manufacturing team. 
          We'll review everything and contact you within 24 hours to confirm details and timeline.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4">Order Details</h3>
        <div className="text-left space-y-2">
          <p><strong>Order ID:</strong> PO-{Date.now()}</p>
          <p><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
          <p><strong>Items:</strong> {cart.length}</p>
          <p><strong>Assets:</strong> {uploadedAssets.length} files</p>
        </div>
      </div>

      <button
        onClick={onPlaceAnotherOrder}
        className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors"
      >
        Place Another Order
      </button>
    </div>
  );
};

export default OrderSuccess;
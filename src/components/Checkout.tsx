import React from 'react';
import { User, CreditCard } from 'lucide-react';
import { ClientInfo, OrderItem, UploadedAsset } from '../types';

interface CheckoutProps {
  clientInfo: ClientInfo;
  cart: OrderItem[];
  uploadedAssets: UploadedAsset[];
  isProcessing: boolean;
  onClientInfoChange: (info: ClientInfo) => void;
  onBack: () => void;
  onSubmitOrder: () => void;
  calculateTotal: () => number;
}

const Checkout: React.FC<CheckoutProps> = ({
  clientInfo,
  cart,
  uploadedAssets,
  isProcessing,
  onClientInfoChange,
  onBack,
  onSubmitOrder,
  calculateTotal
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Order</h2>
        <p className="text-lg text-gray-600">
          Review your order and provide your contact information.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={clientInfo.firstName}
                onChange={(e) => onClientInfoChange({...clientInfo, firstName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={clientInfo.lastName}
                onChange={(e) => onClientInfoChange({...clientInfo, lastName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={clientInfo.email}
              onChange={(e) => onClientInfoChange({...clientInfo, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={clientInfo.phone}
              onChange={(e) => onClientInfoChange({...clientInfo, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company/Brokerage</label>
            <input
              type="text"
              value={clientInfo.company}
              onChange={(e) => onClientInfoChange({...clientInfo, company: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={clientInfo.address}
              onChange={(e) => onClientInfoChange({...clientInfo, address: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={clientInfo.city}
                onChange={(e) => onClientInfoChange({...clientInfo, city: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={clientInfo.state}
                onChange={(e) => onClientInfoChange({...clientInfo, state: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                value={clientInfo.zipCode}
                onChange={(e) => onClientInfoChange({...clientInfo, zipCode: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 block text-sm">Quantity: {item.quantity}</span>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {uploadedAssets.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Uploaded Assets ({uploadedAssets.length})</h4>
              <div className="text-sm text-gray-600">
                {uploadedAssets.map(asset => asset.name).join(', ')}
              </div>
            </div>
          )}

          <div className="bg-amber-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-amber-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Your order will be sent to our production team</li>
              <li>• We'll review your assets and contact you within 24 hours</li>
              <li>• Production typically takes 5-7 business days</li>
              <li>• You'll receive tracking information once shipped</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={onSubmitOrder}
              disabled={isProcessing}
              className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
import React from 'react';
import { Check, X, Package } from 'lucide-react';
import { OrderItem } from '../types';

interface CartDisplayProps {
  cart: OrderItem[];
  onRemoveFromCart: (productId: string) => void;
  calculateTotal: () => number;
  onScrollToBoxes?: () => void;
}

const CartDisplay: React.FC<CartDisplayProps> = ({
  cart,
  onRemoveFromCart,
  calculateTotal,
  onScrollToBoxes
}) => {
  if (cart.length === 0) return null;

  return (
    <div data-cart-display className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-400">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2 rounded-full">
          <Check className="w-5 h-5 text-green-600" />
        </div>
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-gray-900">Your Cart</h3>
        </div>
      </div>
      <div className="space-y-3">
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <span className="font-semibold text-gray-900">{item.name}</span>
              {item.customization && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.customization.designs} design{item.customization.designs > 1 ? 's' : ''}
                    </span>
                    {item.customization.designConfigs && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {item.customization.designConfigs.reduce((total: number, config: any) => total + config.quantity, 0).toLocaleString()} total units
                      </span>
                    )}
                  </div>
                  
                  {/* Design Details */}
                  {item.customization.designConfigs && (
                    <div className="space-y-1">
                      {item.customization.designConfigs.map((config: any, index: number) => (
                        <div key={config.designNumber} className="text-xs text-gray-600 bg-white p-2 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">
                              {config.textEntries?.realtorName ? (
                                `${config.textEntries.realtorName}'s Design`
                              ) : (
                                `Design #${config.designNumber}`
                              )}
                            </span>
                            <span className="text-blue-600 font-medium">
                              {config.quantity.toLocaleString()} units
                            </span>
                          </div>
                          
                          {/* Coffee Selection */}
                          <div className="text-gray-600">
                            {config.textEntries?.useVanityCoffee === 'true' ? (
                              <span className="text-green-600">
                                ☕ {config.textEntries?.vanityCoffeeName || 'Custom Vanity Coffee'}
                              </span>
                            ) : (
                              <span>
                                ☕ {config.roaster} - {config.coffeeSelection}
                              </span>
                            )}
                          </div>
                          
                          {/* Contact Info */}
                          {config.textEntries && (
                            <div className="mt-1 text-gray-500 text-xs">
                              {config.textEntries.phoneNumber && (
                                <span className="mr-3">📞 {config.textEntries.phoneNumber}</span>
                              )}
                              {config.textEntries.email && (
                                <span className="mr-3">✉️ {config.textEntries.email}</span>
                              )}
                              {config.textEntries.brokerageName && (
                                <span>🏢 {config.textEntries.brokerageName}</span>
                              )}
                            </div>
                          )}
                          
                          {/* Assets Count */}
                          {config.assets && config.assets.length > 0 && (
                            <div className="mt-1 text-xs text-purple-600">
                              📎 {config.assets.length} asset{config.assets.length > 1 ? 's' : ''} uploaded
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Box Details */}
                  {item.customization.quantityPerDesign && (
                    <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                      <div className="font-medium text-gray-800 mb-1">📦 Box Configuration</div>
                      <div className="text-gray-600">
                        {item.customization.quantityPerDesign.toLocaleString()} boxes
                        {item.customization.roasterSelections && (
                          <span className="ml-2">
                            • {item.customization.roasterSelections.length} coffee varieties
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <span className="font-bold text-xl text-green-600">${item.price.toLocaleString()}</span>
              <button
                onClick={() => onRemoveFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-4">
          {/* Free Shipping Notice */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300 text-center">
            <div className="text-xl font-bold text-green-800 mb-1">
              🚚 Free Shipping Included! 🚚
            </div>
            <div className="text-sm text-green-600">
              No additional shipping costs • Delivered to your door
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">Total: ${calculateTotal().toLocaleString()}</span>
          </div>
          
          <div className="flex gap-4">
            {onScrollToBoxes && (
              <button
                onClick={onScrollToBoxes}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                + boxes?
              </button>
            )}
            <button
              onClick={() => {
                // Navigate to checkout page
                const event = new CustomEvent('navigateToCheckout');
                window.dispatchEvent(event);
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDisplay;
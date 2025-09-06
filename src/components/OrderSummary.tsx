import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { CustomCoffeeConfig } from '../types';

interface OrderSummaryProps {
  config: CustomCoffeeConfig;
  calculateCoffeePrice: (quantity: number) => number;
  calculateCoffeePriceWithDiscount: (quantity: number, useVanityCoffee: boolean) => number;
  onAddToCart: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  config,
  calculateCoffeePrice,
  calculateCoffeePriceWithDiscount,
  onAddToCart
}) => {
  const totalPrice = config.designConfigs.reduce((total, designConfig) => {
    const pricePerUnit = calculateCoffeePriceWithDiscount(designConfig.quantity, designConfig.textEntries?.useVanityCoffee === 'true');
    return total + (designConfig.quantity * pricePerUnit);
  }, 0);

  const totalUnits = config.designConfigs.reduce((total, designConfig) => total + designConfig.quantity, 0);

  const averagePrice = totalPrice / totalUnits;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-8 rounded-2xl border-2 border-amber-300 shadow-lg">
      <div className="text-center mb-6">
        <h4 className="text-2xl font-bold text-amber-800 mb-2">Your Order Summary</h4>
        <p className="text-amber-600">Here's what we're creating for you</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center bg-white p-3 rounded-lg">
          <span className="text-gray-600">Number of Designs:</span>
          <span className="font-bold text-blue-600">{config.designs}</span>
        </div>
        <div className="flex justify-between items-center bg-white p-3 rounded-lg">
          <span className="text-gray-600">Total Units:</span>
          <span className="font-bold text-blue-600">
            {totalUnits.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center bg-white p-3 rounded-lg">
          <span className="text-gray-600">Average Price per Unit:</span>
          <span className="font-bold text-blue-600">
            ${averagePrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border-2 border-blue-300 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <span>Total Price:</span>
            <div className="text-sm text-gray-500">All inclusive</div>
          </div>
          <span className="text-3xl font-bold text-blue-600">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300 mb-6">
        <div className="text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🚚 Shipping is Always Free! 🚚
          </p>
          <p className="text-sm text-green-700 mt-1">
            (excludes HI & AK)
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg">
        <h5 className="font-bold text-lg text-gray-900 mb-4 text-center">💰 Your Pricing</h5>
        
        {(() => {
          const pricingTiers = [
            { min: 500, max: 999, price: 1.50, label: '500-999', color: 'bg-blue-50 text-blue-600' },
            { min: 1000, max: 1999, price: 1.45, label: '1,000-1,999', color: 'bg-indigo-50 text-indigo-600' },
            { min: 2000, max: 2999, price: 1.40, label: '2,000-2,999', color: 'bg-purple-50 text-purple-600' },
            { min: 3000, max: 3999, price: 1.35, label: '3,000-3,999', color: 'bg-pink-50 text-pink-600' },
            { min: 4000, max: 4999, price: 1.30, label: '4,000-4,999', color: 'bg-rose-50 text-rose-600' },
            { min: 5000, max: Infinity, price: 1.25, label: '5,000+', color: 'bg-emerald-50 text-emerald-600' }
          ];
          
          const currentTierIndex = pricingTiers.findIndex(tier => totalUnits >= tier.min && totalUnits <= tier.max);
          const currentTier = pricingTiers[currentTierIndex];
          const nextTier = currentTierIndex < pricingTiers.length - 1 ? pricingTiers[currentTierIndex + 1] : null;
          
          return (
            <div className="space-y-3">
              {/* Current Tier */}
              <div className={`${currentTier.color} p-4 rounded-lg text-center font-medium shadow-sm border-2`}>
                <div className="text-sm text-gray-600 mb-1">Current Pricing</div>
                <div className="text-lg font-bold mb-1">{currentTier.label} units</div>
                <div className="text-xl font-bold">${currentTier.price.toFixed(2)}/unit</div>
              </div>
              
              {/* Next Tier */}
              {nextTier && (
                <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
                  <div className="text-sm text-gray-500 mb-1">Next Price Break</div>
                  <div className="text-base font-semibold text-gray-700 mb-1">{nextTier.label} units</div>
                  <div className="text-lg font-bold text-green-600">${nextTier.price.toFixed(2)}/unit</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Save ${(currentTier.price - nextTier.price).toFixed(2)}/unit • Need {nextTier.min - totalUnits} more units
                  </div>
                </div>
              )}
              
              {!nextTier && (
                <div className="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-200">
                  <div className="text-sm text-emerald-600 font-medium">🎉 You've reached the best pricing tier!</div>
                </div>
              )}
            </div>
          );
        })()}
        
        <div className="text-center mt-4 text-xs text-gray-500">
          💡 Add more units to unlock better pricing
        </div>
      </div>

      <button
        onClick={onAddToCart}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart ✨
      </button>
    </div>
  );
};

export default OrderSummary;
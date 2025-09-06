import React from 'react';
import { Package, Users, User, ShoppingCart } from 'lucide-react';
import { BoxConfig, CustomCoffeeConfig } from '../types';

interface BoxOrderingSystemProps {
  boxConfig: BoxConfig;
  customCoffeeConfig: CustomCoffeeConfig;
  onUpdateBoxConfig: (field: keyof BoxConfig, value: any) => void;
  onAddBoxesToCart: () => void;
  calculateBoxPrice: (quantity: number) => number;
}

const BoxOrderingSystem: React.FC<BoxOrderingSystemProps> = ({
  boxConfig,
  customCoffeeConfig,
  onUpdateBoxConfig,
  onAddBoxesToCart,
  calculateBoxPrice
}) => {
  const totalCoffeeUnits = customCoffeeConfig.designConfigs.reduce((total, config) => total + config.quantity, 0);
  const unitsNeededForBoxes = boxConfig.packSize * boxConfig.quantity;
  
  // Initialize allocation state if not exists
  const [coffeeAllocation, setCoffeeAllocation] = React.useState<{[key: number]: number}>(() => {
    const initialAllocation: {[key: number]: number} = {};
    customCoffeeConfig.designConfigs.forEach(config => {
      initialAllocation[config.designNumber] = 0; // Units per box
    });
    return initialAllocation;
  });

  // Calculate totals
  const totalAllocatedToBoxes = Object.values(coffeeAllocation).reduce((sum, unitsPerBox) => sum + (unitsPerBox * boxConfig.quantity), 0);
  const remainingLooseUnits = totalCoffeeUnits - totalAllocatedToBoxes;
  const canFulfillBoxOrder = totalAllocatedToBoxes >= unitsNeededForBoxes;

  // Even split function
  const handleEvenSplit = () => {
    const unitsPerBoxPerDesign = Math.floor(boxConfig.packSize / customCoffeeConfig.designConfigs.length);
    const remainder = boxConfig.packSize % customCoffeeConfig.designConfigs.length;
    
    const newAllocation: {[key: number]: number} = {};
    customCoffeeConfig.designConfigs.forEach((config, index) => {
      const baseAllocation = unitsPerBoxPerDesign;
      const extraUnit = index < remainder ? 1 : 0;
      const unitsPerBox = baseAllocation + extraUnit;
      // Ensure we don't exceed available units or pack size
      const maxUnitsPerBox = Math.min(boxConfig.packSize, Math.floor(config.quantity / boxConfig.quantity));
      newAllocation[config.designNumber] = Math.min(unitsPerBox, maxUnitsPerBox);
    });
    
    setCoffeeAllocation(newAllocation);
  };

  // Update allocation for specific design
  const updateAllocation = (designNumber: number, unitsPerBox: number) => {
    setCoffeeAllocation(prev => {
      const newAllocation = { ...prev };
      const currentTotalPerBox = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
      const otherAllocationsPerBox = currentTotalPerBox - (newAllocation[designNumber] || 0);
      
      // If the new allocation would exceed the pack size
      if (otherAllocationsPerBox + unitsPerBox > boxConfig.packSize) {
        const excessUnits = (otherAllocationsPerBox + unitsPerBox) - boxConfig.packSize;
        const availableToReduce = otherAllocationsPerBox;
        
        if (availableToReduce > 0 && excessUnits > 0) {
          // Calculate reduction ratio for other designs
          const reductionRatio = Math.min(1, excessUnits / availableToReduce);
          
          // Reduce other allocations proportionately
          customCoffeeConfig.designConfigs.forEach(config => {
            if (config.designNumber !== designNumber) {
              const currentUnitsPerBox = newAllocation[config.designNumber] || 0;
              const reduction = Math.floor(currentUnitsPerBox * reductionRatio);
              newAllocation[config.designNumber] = Math.max(0, currentUnitsPerBox - reduction);
            }
          });
        }
        
        // Set the new allocation, ensuring we don't exceed pack size
        const finalOtherTotal = Object.entries(newAllocation)
          .filter(([key]) => parseInt(key) !== designNumber)
          .reduce((sum, [, val]) => sum + val, 0);
        
        newAllocation[designNumber] = Math.min(unitsPerBox, boxConfig.packSize - finalOtherTotal);
      } else {
        newAllocation[designNumber] = unitsPerBox;
      }
      
      return newAllocation;
    });
  };

  const calculateBoxAllocation = () => {
    const allocations = customCoffeeConfig.designConfigs.map(config => {
      const unitsPerBox = coffeeAllocation[config.designNumber] || 0;
      const totalAllocatedToBoxes = unitsPerBox * boxConfig.quantity;
      return {
        designNumber: config.designNumber,
        coffeeType: `${config.roaster} - ${config.coffeeSelection}`,
        unitsPerBox,
        totalAllocatedToBoxes,
        remainingLoose: config.quantity - totalAllocatedToBoxes
      };
    });
    
    return allocations;
  };

  const boxAllocations = calculateBoxAllocation();
  const totalBoxPrice = boxConfig.quantity * calculateBoxPrice(boxConfig.quantity);

  return (
    <div id="box-ordering-section" className="bg-transparent p-8">
      <div className="space-y-8">
        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">📦 Box Configuration Progress</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${boxConfig.type && boxConfig.packSize ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium">Step 1: Box Setup</span>
              <div className={`w-3 h-3 rounded-full ${canFulfillBoxOrder ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium">Step 2: Coffee Allocation</span>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{boxConfig.quantity.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Boxes Needed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{boxConfig.packSize}</div>
                <div className="text-sm text-blue-700">Coffees per Box</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{unitsNeededForBoxes.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Total Units Required</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Steps 1, 2, 3 */}
          <div className="space-y-6">
            {/* Step 1: Pack Size Selection */}
            <div className="bg-white p-6 rounded-xl border-2 border-blue-300 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Box Size: <span className="text-blue-600">{boxConfig.packSize}-pack</span>
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {[3, 4, 5, 6, 7, 8].map(size => (
                  <button
                    key={size}
                    onClick={() => onUpdateBoxConfig('packSize', size)}
                    className={`px-4 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-md ${
                      boxConfig.packSize === size
                        ? 'bg-blue-600 text-white shadow-xl border-2 border-blue-700'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400'
                    }`}
                  >
                    {size}-pack
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Quantity Slider */}
            <div className="bg-white p-6 rounded-xl border-2 border-green-300 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <label className="block text-lg font-semibold text-gray-900">
                  <Package className="w-5 h-5 inline mr-2" />
                  Number of Boxes: <span className="text-green-600">{boxConfig.quantity.toLocaleString()}</span>
                </label>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={boxConfig.quantity}
                onChange={(e) => onUpdateBoxConfig('quantity', parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>100 boxes</span>
                <span>1,000 boxes</span>
              </div>
              <div className="text-center mt-3">
                <span className="text-lg font-bold text-green-700 bg-green-100 px-4 py-2 rounded-full">
                  ${calculateBoxPrice(boxConfig.quantity).toFixed(2)}/box • Total: ${(boxConfig.quantity * calculateBoxPrice(boxConfig.quantity)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Step 3: Coffee Allocation Controls */}
            {totalCoffeeUnits > 0 && (
              <div className="bg-white p-6 rounded-xl border-2 border-amber-300 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-bold">3</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Distribute Coffee to Boxes</h4>
                  </div>
                  <button
                    onClick={handleEvenSplit}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 text-sm font-bold shadow-lg"
                  >
                    ✨ ⚖️ Even Split ✨
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{boxConfig.packSize}</div>
                      <div className="text-sm text-amber-700">Units Per Box</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className={`text-2xl font-bold ${canFulfillBoxOrder ? 'text-green-600' : 'text-red-600'}`}>
                        {Object.values(coffeeAllocation).reduce((sum, val) => sum + val, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Units Allocated Per Box</div>
                    </div>
                  </div>
                  {!canFulfillBoxOrder && (
                    <div className="mt-3 text-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        ⚠️ Need {boxConfig.packSize - Object.values(coffeeAllocation).reduce((sum, val) => sum + val, 0)} more units per box
                      </span>
                    </div>
                  )}
                  {canFulfillBoxOrder && (
                    <div className="mt-3 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        ✅ Allocation Complete!
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {customCoffeeConfig.designConfigs.map(config => {
                    const unitsPerBox = coffeeAllocation[config.designNumber] || 0;
                    const totalAllocatedToBoxes = unitsPerBox * boxConfig.quantity;
                    const maxUnitsPerBox = Math.min(boxConfig.packSize, Math.floor(config.quantity / boxConfig.quantity));
                    const allocationPercentage = maxUnitsPerBox > 0 ? (unitsPerBox / maxUnitsPerBox) * 100 : 0;
                    
                    return (
                      <div key={config.designNumber} className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl border-2 border-amber-200 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <span className="text-amber-600 font-bold text-sm">#{config.designNumber}</span>
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">
                                {config.textEntries?.realtorName ? (
                                  <>
                                    {config.textEntries.realtorName} Design: {config.roaster} - {config.coffeeSelection}
                                  </>
                                ) : (
                                  <>
                                    Design #{config.designNumber}: {config.roaster} - {config.coffeeSelection}
                                  </>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                Available: {config.quantity.toLocaleString()} units
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-amber-600">
                              {unitsPerBox}
                            </div>
                            <div className="text-xs text-gray-500">per box</div>
                          </div>
                        </div>
                      
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-medium text-gray-700">
                              Units Per Box for {config.textEntries?.realtorName ? `${config.textEntries.realtorName} Design` : `Design #${config.designNumber}`}: {unitsPerBox} of {boxConfig.packSize}
                            </label>
                            <div className="bg-amber-100 px-2 py-1 rounded text-xs font-medium text-amber-700">
                              {allocationPercentage.toFixed(0)}% of max per box
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={maxUnitsPerBox}
                            step="1"
                            value={unitsPerBox}
                            onChange={(e) => updateAllocation(config.designNumber, parseInt(e.target.value))}
                            className="w-full h-2 bg-gradient-to-r from-amber-200 to-orange-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>{maxUnitsPerBox}</span>
                          </div>
                        </div>
                      
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-blue-50 p-2 rounded text-center">
                            <div className="text-xs font-bold text-blue-600">{totalAllocatedToBoxes.toLocaleString()}</div>
                            <div className="text-xs text-blue-700">Total to Boxes</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded text-center">
                            <div className="text-xs font-bold text-green-600">{(config.quantity - totalAllocatedToBoxes).toLocaleString()}</div>
                            <div className="text-xs text-green-700">Remaining Loose</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Box Summary and Allocation */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-gray-300">
              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📋 Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <span className="text-gray-600">Pack Size:</span>
                    <span className="font-bold text-green-600">{boxConfig.packSize} coffees per box</span>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <span className="text-gray-600">Number of Boxes:</span>
                    <span className="font-bold text-purple-600">{boxConfig.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                    <span className="text-gray-600">Total Coffee Units Needed:</span>
                    <span className="font-bold text-amber-600">{unitsNeededForBoxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-gray-300">
                    <span className="text-gray-600">Currently Allocated:</span>
                    <span className={`font-bold ${canFulfillBoxOrder ? 'text-green-600' : 'text-red-600'}`}>
                      {totalAllocatedToBoxes.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl border-2 border-amber-400 mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-gray-900">Total Box Cost:</span>
                      <div className="text-sm text-amber-700">Packaging & assembly</div>
                    </div>
                    <span className="text-3xl font-bold text-amber-600">
                      ${totalBoxPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coffee Allocation */}
              {totalCoffeeUnits > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">☕ Coffee Distribution</h4>
                  
                  {canFulfillBoxOrder ? (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300">
                        <div className="text-center mb-3">
                          <div className="text-lg font-bold text-green-800 mb-1">✅ Allocation Complete!</div>
                          <div className="text-sm text-green-600">
                            Allocated {Object.values(coffeeAllocation).reduce((sum, val) => sum + val, 0)} of {boxConfig.packSize} units per box
                          </div>
                        </div>
                      </div>
                      
                      {boxAllocations.map(allocation => (
                        <div key={allocation.designNumber} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <span className="text-amber-600 font-bold text-sm">#{allocation.designNumber}</span>
                            </div>
                            <div className="font-bold text-gray-900">
                              {customCoffeeConfig.designConfigs.find(config => config.designNumber === allocation.designNumber)?.textEntries?.realtorName ? (
                                <>
                                  {customCoffeeConfig.designConfigs.find(config => config.designNumber === allocation.designNumber)?.textEntries?.realtorName} Design: {allocation.coffeeType}
                                </>
                              ) : (
                                <>
                                  Design #{allocation.designNumber}: {allocation.coffeeType}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 p-2 rounded text-center">
                              <div className="text-sm font-bold text-blue-600">{allocation.totalAllocatedToBoxes.toLocaleString()}</div>
                              <div className="text-xs text-blue-700">📦 Total to Boxes ({allocation.unitsPerBox}/box)</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded text-center">
                              <div className="text-sm font-bold text-green-600">{allocation.remainingLoose.toLocaleString()}</div>
                              <div className="text-xs text-green-700">📋 Loose Units</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {remainingLooseUnits > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-300">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-800">
                              📋 Total remaining loose units: {remainingLooseUnits.toLocaleString()}
                            </div>
                            <div className="text-sm text-blue-600 mt-1">Available for individual distribution</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-300">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-800 mb-2">⚠️ Insufficient Coffee Allocation</div>
                        <div className="text-sm text-red-600">
                          You need {boxConfig.packSize} units per box but only allocated {Object.values(coffeeAllocation).reduce((sum, val) => sum + val, 0)}.
                          <br />Please adjust your per-box allocation sliders above.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {totalCoffeeUnits === 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-xl border-2 border-yellow-400 shadow-lg mb-8">
                  <div className="text-center">
                    <Package className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-yellow-800 mb-2">No Coffee Available</h4>
                    <p className="text-sm text-yellow-600">
                      Please configure and add coffee to your cart first, then return here to create boxes.
                    </p>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={onAddBoxesToCart}
                disabled={!canFulfillBoxOrder || totalCoffeeUnits === 0 || Object.values(coffeeAllocation).reduce((sum, val) => sum + val, 0) < boxConfig.packSize}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 flex items-center justify-center gap-3 font-bold text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingCart className="w-5 h-5" />
                Add Boxes to Cart 📦
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxOrderingSystem;
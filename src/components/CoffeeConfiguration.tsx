import React from 'react';
import { Coffee, Star, Package, Upload, X, FileText, Image } from 'lucide-react';
import { CustomCoffeeConfig } from '../types';

interface CoffeeConfigurationProps {
  config: CustomCoffeeConfig;
  onUpdateConfig: (field: string, value: any) => void;
  onUpdateDesignConfig: (designNumber: number, field: 'quantity' | 'roaster' | 'coffeeSelection', value: string | number) => void;
  onUpdateDesignTextEntry: (designNumber: number, field: string, value: string) => void;
  onUploadDesignAsset: (designNumber: number, files: FileList) => void;
  onRemoveDesignAsset: (designNumber: number, assetId: string) => void;
  calculateCoffeePrice: (quantity: number) => number;
  calculateCoffeePriceWithDiscount: (quantity: number, useVanityCoffee: boolean) => number;
}

const CoffeeConfiguration: React.FC<CoffeeConfigurationProps> = ({
  config,
  onUpdateConfig,
  onUpdateDesignConfig,
  onUpdateDesignTextEntry,
  onUploadDesignAsset,
  onRemoveDesignAsset,
  calculateCoffeePrice,
  calculateCoffeePriceWithDiscount
}) => {
  return (
    <div className="space-y-8">
      {/* Number of Designs Slider */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-300 shadow-md">
        <div className="text-center mb-4">
          <p className="text-xl font-bold text-blue-800 mb-1">
            Ordering For A Team? Add Multiple Designs.
          </p>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Coffee className="w-4 h-4 inline mr-2" />
          Number of Unique Designs: <span className="text-blue-600 font-bold text-lg">{config.designs}</span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={config.designs}
          onChange={(e) => onUpdateConfig('designs', parseInt(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 Design</span>
          <span>20 Designs</span>
        </div>
      </div>

      {/* Roaster Selections */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-300 shadow-md">
        <div className="text-center mb-4">
          <Star className="w-5 h-5 text-blue-600" />
          <h4 className="text-xl font-semibold text-blue-800">Whose Coffee Would You Like To Use?</h4>
        </div>
        <div className="text-center mb-4">
          <p className="text-sm text-blue-600">We'll work with them to create your custom blends</p>
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto relative">
          {/* Scroll indicator */}
          <div className="absolute top-0 right-2 z-10 bg-blue-100 text-blue-600 px-2 py-1 rounded-b text-xs font-medium shadow-sm">
            ↓ Scroll for more options
          </div>
          {config.designConfigs.map((designConfig) => (
            <div key={designConfig.designNumber} className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm min-h-[500px]">
              <h5 className="font-semibold text-lg text-gray-900 mb-4">
                {designConfig.textEntries?.realtorName ? (
                  <>
                    {designConfig.textEntries.realtorName} Design
                    {!designConfig.textEntries?.useVanityCoffee && designConfig.roaster && (
                      <span className="text-blue-600">: {designConfig.roaster}</span>
                    )}
                    {designConfig.textEntries?.useVanityCoffee && designConfig.textEntries?.vanityCoffeeName && (
                      <span className="text-green-600">: {designConfig.textEntries.vanityCoffeeName}</span>
                    )}
                  </>
                ) : (
                  <>
                    Design #{designConfig.designNumber}
                    {!designConfig.textEntries?.useVanityCoffee && designConfig.roaster && (
                      <span className="text-blue-600">: {designConfig.roaster}</span>
                    )}
                    {designConfig.textEntries?.useVanityCoffee && designConfig.textEntries?.vanityCoffeeName && (
                      <span className="text-green-600">: {designConfig.textEntries.vanityCoffeeName}</span>
                    )}
                  </>
                )}
              </h5>
              
              {/* Quantity Slider for this design */}
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  <Package className="w-4 h-4 inline mr-2" />
                  Quantity for Design #{designConfig.designNumber}: {designConfig.quantity.toLocaleString()} units
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={designConfig.quantity}
                  onChange={(e) => onUpdateDesignConfig(designConfig.designNumber, 'quantity', parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>500 units</span>
                  <span>5,000 units</span>
                </div>
                <div className="text-center mt-3">
                  <span className="text-base font-medium text-blue-700 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-full">
                    ${calculateCoffeePriceWithDiscount(designConfig.quantity, designConfig.textEntries?.useVanityCoffee === 'true').toFixed(2)}/unit
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Vanity Coffee Option */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id={`vanity-coffee-${designConfig.designNumber}`}
                      checked={designConfig.textEntries?.useVanityCoffee || false}
                      onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'useVanityCoffee', e.target.checked ? 'true' : '')}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <label htmlFor={`vanity-coffee-${designConfig.designNumber}`} className="text-base font-medium text-green-800">
                      Use Our Vanity Coffee Service
                    </label>
                    <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-bold">
                      <div>Save $0.10/unit</div>
                      <div>Receive 7-10 days sooner</div>
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mb-4 italic">
                    We'll create a custom coffee blend with your personalized name - no need to coordinate with external roasters.
                  </p>
                  
                  {designConfig.textEntries?.useVanityCoffee && (
                    <div>
                      <label className="block text-base font-medium text-green-800 mb-2">
                        Custom Coffee Name:
                      </label>
                      <input
                        type="text"
                        value={designConfig.textEntries?.vanityCoffeeName || ''}
                        onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'vanityCoffeeName', e.target.value)}
                        placeholder="e.g., Devin's Blend, Grand Avenue Blend, Sunrise Roast"
                        className="w-full border border-green-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      />
                    </div>
                  )}
                </div>
                
                {!designConfig.textEntries?.useVanityCoffee && (
                  <>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Roaster Name:
                      </label>
                      <input
                        type="text"
                        value={designConfig.roaster}
                        onChange={(e) => onUpdateDesignConfig(designConfig.designNumber, 'roaster', e.target.value)}
                        placeholder="e.g., Blue Bottle Coffee, Stumptown"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Coffee Name:
                      </label>
                      <input
                        type="text"
                        value={designConfig.coffeeSelection}
                        onChange={(e) => onUpdateDesignConfig(designConfig.designNumber, 'coffeeSelection', e.target.value)}
                        placeholder="e.g., Ethiopian Single Origin, House Blend"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      />
                    </div>
                  </>
                )}
              </div>
              
              {/* Design Assets Upload */}
              <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <h6 className="font-semibold text-base text-gray-900 mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-600" />
                  Realtor Information and Assets for {designConfig.textEntries?.realtorName ? `${designConfig.textEntries.realtorName} Design` : `Coffee #${designConfig.designNumber}`}
                </h6>
                
                {/* Text Entries Section */}
                <div className="mb-5 p-4 bg-white rounded-lg border border-purple-200">
                  <h6 className="font-semibold text-gray-800 mb-3 text-base">Contact & Business Information</h6>
                  <p className="text-sm text-gray-600 mb-4 italic">Complete only the information you want included on your design</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Realtor Name</label>
                      <input
                        type="text"
                        value={designConfig.textEntries?.realtorName || ''}
                        onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'realtorName', e.target.value)}
                        placeholder="Your full name"
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={designConfig.textEntries?.phoneNumber || ''}
                        onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'phoneNumber', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={designConfig.textEntries?.email || ''}
                        onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'email', e.target.value)}
                        placeholder="your.email@company.com"
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={designConfig.textEntries?.website || ''}
                        onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'website', e.target.value)}
                        placeholder="www.yourwebsite.com"
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brokerage Name</label>
                      <input
                        type="text"
                        value={designConfig.textEntries?.brokerageName || ''}
                        onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'brokerageName', e.target.value)}
                        placeholder="Your Brokerage Name"
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                    <textarea
                      value={designConfig.textEntries?.additionalInfo || ''}
                      onChange={(e) => onUpdateDesignTextEntry(designConfig.designNumber, 'additionalInfo', e.target.value)}
                      placeholder="Any additional text you'd like on your coffee packaging (certifications, special offers, etc.)"
                      rows={3}
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <p className="text-sm text-gray-600 mb-4">
                  Upload your headshot, brokerage logo, contact info, or any other assets for this specific design. Consider including a QR code that links to your website for easy client access.
                </p>
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.ai,.eps"
                    onChange={(e) => e.target.files && onUploadDesignAsset(designConfig.designNumber, e.target.files)}
                    className="hidden"
                    id={`design-upload-${designConfig.designNumber}`}
                  />
                  <label
                    htmlFor={`design-upload-${designConfig.designNumber}`}
                    className="cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-base text-blue-600 font-medium">Click to upload assets</p>
                    <p className="text-sm text-gray-500">PNG, JPG, PDF, AI, EPS (Max 10MB each)</p>
                  </label>
                </div>
                
                {/* Display uploaded assets for this design */}
                {designConfig.assets && designConfig.assets.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Assets:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {designConfig.assets.map(asset => (
                        <div key={asset.id} className="relative bg-white rounded p-3 border border-blue-100">
                          <div className="flex items-center gap-3">
                            {asset.preview ? (
                              <img src={asset.preview} alt={asset.name} className="w-10 h-10 object-cover rounded" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                {asset.type.startsWith('image/') ? (
                                  <Image className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <FileText className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            )}
                            <span className="text-sm text-gray-700 truncate flex-1">{asset.name}</span>
                            <button
                              onClick={() => onRemoveDesignAsset(designConfig.designNumber, asset.id)}
                              className="text-red-400 hover:text-red-600 p-1.5"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoffeeConfiguration;
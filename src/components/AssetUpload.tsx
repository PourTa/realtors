import React from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { UploadedAsset } from '../types';

interface AssetUploadProps {
  uploadedAssets: UploadedAsset[];
  orderNotes: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAsset: (assetId: string) => void;
  onOrderNotesChange: (notes: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const AssetUpload: React.FC<AssetUploadProps> = ({
  uploadedAssets,
  orderNotes,
  onFileUpload,
  onRemoveAsset,
  onOrderNotesChange,
  onBack,
  onContinue
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Design Assets</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your logos, brand guidelines, and any specific design requirements for your custom products.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to upload</h3>
          <p className="text-gray-600 mb-4">Supported formats: PNG, JPG, PDF, AI, EPS (Max 10MB each)</p>
          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.pdf,.ai,.eps"
            onChange={onFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer inline-block"
          >
            Choose Files
          </label>
        </div>

        {uploadedAssets.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4">Uploaded Assets</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedAssets.map(asset => (
                <div key={asset.id} className="relative bg-gray-50 rounded-lg p-4">
                  {asset.preview ? (
                    <img src={asset.preview} alt={asset.name} className="w-full h-20 object-cover rounded mb-2" />
                  ) : (
                    <div className="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm text-gray-700 truncate">{asset.name}</p>
                  <button
                    onClick={() => onRemoveAsset(asset.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions or Notes
          </label>
          <textarea
            value={orderNotes}
            onChange={(e) => onOrderNotesChange(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Any specific requirements, color preferences, or special instructions..."
          />
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Products
          </button>
          <button
            onClick={onContinue}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Continue to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetUpload;
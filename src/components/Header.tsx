import React from 'react';
import { Coffee, ShoppingCart, Upload, CreditCard, Check } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
}

const Header: React.FC<HeaderProps> = ({ currentStep }) => {
  return (
    <header className="bg-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/2025_logo.webp" 
              alt="Pour Ta Coffee Logo" 
             className="w-48 h-48 object-contain -my-8"
            />
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-4">
            {[
              { step: 1, label: 'Products', icon: ShoppingCart },
              { step: 2, label: 'Assets', icon: Upload },
              { step: 3, label: 'Checkout', icon: CreditCard },
              { step: 4, label: 'Complete', icon: Check },
              { step: 5, label: 'Payment', icon: CreditCard }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-white text-slate-800' : 'bg-slate-600 text-slate-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm ${currentStep >= step ? 'text-white font-medium' : 'text-slate-200'}`}>
                  {label}
                </span>
                {step < 5 && <div className="w-8 h-px bg-slate-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import HeroSection from './HeroSection';
import UsesBanner from './UsesBanner';
import CoffeeConfiguration from './CoffeeConfiguration';
import OrderSummary from './OrderSummary';
import CartDisplay from './CartDisplay';
import BoxOrderingSystem from './BoxOrderingSystem';
import { OrderItem, CustomCoffeeConfig, UploadedAsset, BoxConfig } from '../types';

interface ProductCatalogProps {
  customCoffeeConfig: CustomCoffeeConfig;
  boxConfig: BoxConfig;
  cart: OrderItem[];
  onUpdateCustomCoffeeConfig: (field: string, value: any) => void;
  onUpdateDesignConfig: (designNumber: number, field: 'quantity' | 'roaster' | 'coffeeSelection', value: string | number) => void;
  onUpdateDesignTextEntry: (designNumber: number, field: string, value: string) => void;
  onUploadDesignAsset: (designNumber: number, files: FileList) => void;
  onRemoveDesignAsset: (designNumber: number, assetId: string) => void;
  onUpdateBoxConfig: (field: keyof BoxConfig, value: any) => void;
  onAddCustomCoffeeToCart: () => void;
  onAddBoxesToCart: () => void;
  onRemoveFromCart: (productId: string) => void;
  calculateCoffeePrice: (quantity: number) => number;
  calculateBoxPrice: (quantity: number) => number;
  calculateCoffeePriceWithDiscount: (quantity: number, useVanityCoffee: boolean) => number;
  calculateTotal: () => number;
  onContinueToAssets: () => void;
  onNavigateToCheckout: () => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  customCoffeeConfig,
  boxConfig,
  cart,
  onUpdateCustomCoffeeConfig,
  onUpdateDesignConfig,
  onUpdateDesignTextEntry,
  onUploadDesignAsset,
  onRemoveDesignAsset,
  onUpdateBoxConfig,
  onAddCustomCoffeeToCart,
  onAddBoxesToCart,
  onRemoveFromCart,
  calculateCoffeePrice,
  calculateBoxPrice,
  calculateCoffeePriceWithDiscount,
  calculateTotal,
  onContinueToAssets,
  onNavigateToCheckout
}) => {
  React.useEffect(() => {
    const handleNavigateToCheckout = () => {
      onNavigateToCheckout();
    };

    window.addEventListener('navigateToCheckout', handleNavigateToCheckout);
    return () => window.removeEventListener('navigateToCheckout', handleNavigateToCheckout);
  }, [onNavigateToCheckout]);

  const scrollToBoxes = () => {
    const boxSection = document.getElementById('box-ordering-section');
    if (boxSection) {
      boxSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="space-y-12">
      <HeroSection />
      <UsesBanner />

      <div className="bg-transparent p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <CoffeeConfiguration
            config={customCoffeeConfig}
            onUpdateConfig={onUpdateCustomCoffeeConfig}
            onUpdateDesignConfig={onUpdateDesignConfig}
            onUpdateDesignTextEntry={onUpdateDesignTextEntry}
            onUploadDesignAsset={onUploadDesignAsset}
            onRemoveDesignAsset={onRemoveDesignAsset}
            calculateCoffeePrice={calculateCoffeePrice}
            calculateCoffeePriceWithDiscount={calculateCoffeePriceWithDiscount}
          />
          
          <OrderSummary
            config={customCoffeeConfig}
            calculateCoffeePrice={calculateCoffeePrice}
            calculateCoffeePriceWithDiscount={calculateCoffeePriceWithDiscount}
            onAddToCart={onAddCustomCoffeeToCart}
          />
        </div>
      </div>

      {/* Page Break Image */}
      <div className="text-center py-8">
        <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-tight">
          + boxes for your team, too?
        </span>
      </div>
      
      <div className="flex justify-center pb-8">
        <img 
          src="/src/assets/roam_together copy.webp" 
          alt="Roam Together" 
          className="max-w-full h-auto"
        />
      </div>

      {/* Box Ordering System */}
      <BoxOrderingSystem
        boxConfig={boxConfig}
        customCoffeeConfig={customCoffeeConfig}
        onUpdateBoxConfig={onUpdateBoxConfig}
        onAddBoxesToCart={onAddBoxesToCart}
        calculateBoxPrice={calculateBoxPrice}
      />

      <CartDisplay
        cart={cart}
        onRemoveFromCart={onRemoveFromCart}
        calculateTotal={calculateTotal}
        onScrollToBoxes={cart.length > 0 ? scrollToBoxes : undefined}
      />
    </div>
  );
};

export default ProductCatalog;
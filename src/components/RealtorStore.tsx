import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ProductCatalog from './ProductCatalog';
import AssetUpload from './AssetUpload';
import Checkout from './Checkout';
import OrderSuccess from './OrderSuccess';
import StripeCheckout from './StripeCheckout';
import { OrderItem, ClientInfo, UploadedAsset, CustomCoffeeConfig, BoxConfig } from '../types';

const RealtorStore: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customCoffeeConfig, setCustomCoffeeConfig] = useState<CustomCoffeeConfig>({
    designs: 1,
    designConfigs: [{ 
      designNumber: 1, 
      quantity: 500,
      roaster: '', 
      coffeeSelection: '' 
    }]
  });
  const [boxConfig, setBoxConfig] = useState<BoxConfig>({
    packSize: 4,
    quantity: 100,
    type: 'individual'
  });

  const calculateCoffeePrice = (quantity: number) => {
    if (quantity >= 5000) return 1.25;
    if (quantity >= 4000) return 1.30;
    if (quantity >= 3000) return 1.35;
    if (quantity >= 2000) return 1.40;
    if (quantity >= 1000) return 1.45;
    return 1.50;
  };

  const calculateCoffeePriceWithDiscount = (quantity: number, useVanityCoffee: boolean) => {
    const basePrice = calculateCoffeePrice(quantity);
    return useVanityCoffee ? basePrice - 0.10 : basePrice;
  };
  const calculateBoxPrice = (quantity: number) => {
    // Base price calculation (linear interpolation from $4.50 at 100 units to $2.35 at 1000 units)
    const minPrice = 2.35;
    const maxPrice = 4.50;
    const minQuantity = 100;
    const maxQuantity = 1000;
    
    const priceRange = maxPrice - minPrice;
    const quantityRange = maxQuantity - minQuantity;
    const quantityRatio = (maxQuantity - quantity) / quantityRange;
    
    const basePrice = minPrice + (priceRange * quantityRatio);
    
    // Adjust price based on pack size: reduce by $0.04 for each increment from 8-pack to 3-pack
    // 8-pack: +$0.00, 7-pack: -$0.04, 6-pack: -$0.08, 5-pack: -$0.12, 4-pack: -$0.16, 3-pack: -$0.20
    const packSizeAdjustment = (8 - boxConfig.packSize) * 0.04;
    
    return Math.max(0.50, basePrice - packSizeAdjustment); // Minimum price floor of $0.50
  };

  const updateBoxConfig = (field: keyof BoxConfig, value: any) => {
    setBoxConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateCustomCoffeeConfig = (field: string, value: any) => {
    setCustomCoffeeConfig(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'designs') {
        // Update design configs array based on number of designs
        const newConfigs = Array.from({ length: value }, (_, i) => ({
          designNumber: i + 1,
          quantity: prev.designConfigs[i]?.quantity || 500,
          roaster: prev.designConfigs[i]?.roaster || '',
          coffeeSelection: prev.designConfigs[i]?.coffeeSelection || '',
          textEntries: prev.designConfigs[i]?.textEntries || {}
        }));
        updated.designConfigs = newConfigs;
      }
      
      return updated;
    });
  };

  const updateDesignConfig = (designNumber: number, field: 'quantity' | 'roaster' | 'coffeeSelection', value: string | number) => {
    setCustomCoffeeConfig(prev => ({
      ...prev,
      designConfigs: prev.designConfigs.map(config =>
        config.designNumber === designNumber
          ? { ...config, [field]: value }
          : config
      )
    }));
  };

  const updateDesignTextEntry = (designNumber: number, field: string, value: string) => {
    setCustomCoffeeConfig(prev => ({
      ...prev,
      designConfigs: prev.designConfigs.map(config =>
        config.designNumber === designNumber
          ? { 
              ...config, 
              textEntries: { 
                ...config.textEntries, 
                [field]: value 
              } 
            }
          : config
      )
    }));
  };
  const uploadDesignAsset = (designNumber: number, files: FileList) => {
    Array.from(files).forEach(file => {
      const asset: UploadedAsset = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        file,
        type: file.type
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          asset.preview = e.target?.result as string;
          setCustomCoffeeConfig(prev => ({
            ...prev,
            designConfigs: prev.designConfigs.map(config =>
              config.designNumber === designNumber
                ? { ...config, assets: [...(config.assets || []), asset] }
                : config
            )
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setCustomCoffeeConfig(prev => ({
          ...prev,
          designConfigs: prev.designConfigs.map(config =>
            config.designNumber === designNumber
              ? { ...config, assets: [...(config.assets || []), asset] }
              : config
          )
        }));
      }
    });
  };

  const removeDesignAsset = (designNumber: number, assetId: string) => {
    setCustomCoffeeConfig(prev => ({
      ...prev,
      designConfigs: prev.designConfigs.map(config =>
        config.designNumber === designNumber
          ? { ...config, assets: (config.assets || []).filter(asset => asset.id !== assetId) }
          : config
      )
    }));
  };

  const addCustomCoffeeToCart = () => {
    const totalPrice = customCoffeeConfig.designConfigs.reduce((total, config) => {
      const pricePerUnit = calculateCoffeePriceWithDiscount(config.quantity, config.textEntries?.useVanityCoffee === 'true');
      return total + (config.quantity * pricePerUnit);
    }, 0);
    
    const totalQuantity = customCoffeeConfig.designConfigs.reduce((total, config) => total + config.quantity, 0);
    
    const customCoffeeItem: OrderItem = {
      id: 'custom-single-serve-coffee',
      name: 'Fully Customized Single Serve Coffees',
      price: totalPrice,
      quantity: 1,
      customization: {
        designs: customCoffeeConfig.designs,
        designConfigs: customCoffeeConfig.designConfigs
      }
    };

    const existingItem = cart.find(item => item.id === 'custom-single-serve-coffee');
    if (existingItem) {
      // Replace existing custom coffee order
      setCart(cart.map(item => 
        item.id === 'custom-single-serve-coffee' ? customCoffeeItem : item
      ));
    } else {
      setCart([...cart, customCoffeeItem]);
    }
    
    // Auto-scroll to cart after adding item
    setTimeout(() => {
      const cartElement = document.querySelector('[data-cart-display]');
      if (cartElement) {
        cartElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const addBoxesToCart = () => {
    const totalCoffeeUnits = customCoffeeConfig.designConfigs.reduce((total, config) => total + config.quantity, 0);
    const unitsNeededForBoxes = boxConfig.packSize * boxConfig.quantity;
    
    if (totalCoffeeUnits < unitsNeededForBoxes) {
      alert('Insufficient coffee units for the requested boxes. Please increase your coffee order.');
      return;
    }
    
    const boxPrice = calculateBoxPrice(boxConfig.quantity);
    const totalBoxPrice = boxConfig.quantity * boxPrice;
    
    const boxItem: OrderItem = {
      id: `variety-boxes-${boxConfig.packSize}pack-${boxConfig.type}`,
      name: `${boxConfig.packSize}-Pack Variety Boxes (${boxConfig.type})`,
      price: totalBoxPrice,
      quantity: 1,
      customization: {
        designs: customCoffeeConfig.designs,
        quantityPerDesign: boxConfig.quantity,
        roasterSelections: customCoffeeConfig.designConfigs.map(config => ({
          designNumber: config.designNumber,
          roaster: config.roaster,
          coffeeSelection: config.coffeeSelection
        }))
      }
    };

    const existingBoxItem = cart.find(item => item.id.startsWith('variety-boxes-'));
    if (existingBoxItem) {
      // Replace existing box order
      setCart(cart.map(item => 
        item.id.startsWith('variety-boxes-') ? boxItem : item
      ));
    } else {
      setCart([...cart, boxItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const asset: UploadedAsset = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        file,
        type: file.type
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          asset.preview = e.target?.result as string;
          setUploadedAssets(prev => [...prev, asset]);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadedAssets(prev => [...prev, asset]);
      }
    });
  };

  const removeAsset = (assetId: string) => {
    setUploadedAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would integrate with your Pour Ta Manufacturing Management system
    const orderData = {
      orderId: `PO-${Date.now()}`,
      client: clientInfo,
      items: cart,
      assets: uploadedAssets.map(asset => ({
        name: asset.name,
        type: asset.type,
        // In real implementation, you'd upload files to your server
      })),
      notes: orderNotes,
      total: calculateTotal(),
      timestamp: new Date().toISOString()
    };

    console.log('Order submitted to Pour Ta Manufacturing:', orderData);
    
    setIsProcessing(false);
    setCurrentStep(4); // Success step
  };

  const resetOrder = () => {
    setCurrentStep(1);
    setCart([]);
    setUploadedAssets([]);
    setClientInfo({
      firstName: '', lastName: '', email: '', phone: '', company: '',
      address: '', city: '', state: '', zipCode: ''
    });
    setOrderNotes('');
    setBoxConfig({
      packSize: 4,
      quantity: 100,
      type: 'individual'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header currentStep={currentStep} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 1 && (
          <ProductCatalog
            customCoffeeConfig={customCoffeeConfig}
            boxConfig={boxConfig}
            cart={cart}
            onUpdateCustomCoffeeConfig={updateCustomCoffeeConfig}
            onUpdateDesignConfig={updateDesignConfig}
            onUpdateDesignTextEntry={updateDesignTextEntry}
            onUploadDesignAsset={uploadDesignAsset}
            onRemoveDesignAsset={removeDesignAsset}
            onUpdateBoxConfig={updateBoxConfig}
            onAddCustomCoffeeToCart={addCustomCoffeeToCart}
            onAddBoxesToCart={addBoxesToCart}
            onRemoveFromCart={removeFromCart}
            calculateCoffeePrice={calculateCoffeePrice}
            calculateBoxPrice={calculateBoxPrice}
            calculateTotal={calculateTotal}
            calculateCoffeePriceWithDiscount={calculateCoffeePriceWithDiscount}
            onContinueToAssets={() => setCurrentStep(2)}
            onNavigateToCheckout={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 2 && (
          <AssetUpload
            uploadedAssets={uploadedAssets}
            orderNotes={orderNotes}
            onFileUpload={handleFileUpload}
            onRemoveAsset={removeAsset}
            onOrderNotesChange={setOrderNotes}
            onBack={() => setCurrentStep(1)}
            onContinue={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && (
          <Checkout
            clientInfo={clientInfo}
            cart={cart}
            uploadedAssets={uploadedAssets}
            isProcessing={isProcessing}
            onClientInfoChange={setClientInfo}
            onBack={() => setCurrentStep(2)}
            onSubmitOrder={handleSubmitOrder}
            calculateTotal={calculateTotal}
          />
        )}
        {currentStep === 4 && (
          <OrderSuccess
            cart={cart}
            uploadedAssets={uploadedAssets}
            calculateTotal={calculateTotal}
            onPlaceAnotherOrder={resetOrder}
          />
        )}
        {currentStep === 5 && (
          <StripeCheckout
            cart={cart}
            calculateTotal={calculateTotal}
            onBack={() => setCurrentStep(1)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RealtorStore;
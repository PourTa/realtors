export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    designs?: number;
    quantityPerDesign?: number;
    roasterSelections?: Array<{
      designNumber: number;
      roaster: string;
      coffeeSelection: string;
    }>;
    designConfigs?: Array<{
      designNumber: number;
      quantity: number;
      roaster: string;
      coffeeSelection: string;
    }>;
  };
}

export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UploadedAsset {
  id: string;
  name: string;
  file: File;
  type: string;
  preview?: string;
}

export interface CustomCoffeeConfig {
  designs: number;
  designConfigs: Array<{
    designNumber: number;
    quantity: number;
    roaster: string;
    coffeeSelection: string;
    assets?: UploadedAsset[];
    textEntries?: {
      realtorName?: string;
      phoneNumber?: string;
      email?: string;
      website?: string;
      brokerageName?: string;
      tagline?: string;
      useVanityCoffee?: string;
      vanityCoffeeName?: string;
      additionalInfo?: string;
    };
  }>;
}
export interface BoxConfig {
  packSize: number; // 3, 4, 5, 6, 7, 8
  quantity: number; // 100-1000
  type: 'individual' | 'brokerage';
}

export interface BoxAllocation {
  designNumber: number;
  coffeeType: string;
  allocatedToBoxes: number;
  remainingLoose: number;
}
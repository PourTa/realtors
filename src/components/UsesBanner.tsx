import React from 'react';

const UsesBanner: React.FC = () => {
  const uses = [
    { 
      image: '/src/assets/website_assets-01 copy.webp', 
      text: 'Open Houses' 
    },
    { 
      image: '/src/assets/website_assets-02 copy.webp', 
      text: 'Client Gifts' 
    },
    { 
      image: '/src/assets/website_assets-03 copy.webp', 
      text: 'Office Welcome' 
    },
    { 
      image: '/src/assets/website_assets-04 copy.webp', 
      text: 'Closing Gifts' 
    }
  ];

  return (
    <div className="bg-slate-800 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">
            OUR COFFEE BREW BAGS ARE PERFECT FOR:
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uses.map(({ image, text }, index) => (
            <div key={index} className="group">
              <div className="bg-transparent rounded-2xl p-2 transition-all duration-300 group-hover:scale-105">
                <img 
                  src={image} 
                  alt={text}
                  className="w-40 h-40 mx-auto object-contain"
                />
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default UsesBanner;
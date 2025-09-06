import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Left Side - Hey Realtor Image and Text */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <img 
              src="/src/assets/heyroaster.webp" 
              alt="Hey Realtor" 
              className="w-full max-w-lg mx-auto lg:mx-0 rounded-xl"
            />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="whitespace-nowrap">Ditch your business card.</span><br />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Share a customized cup of coffee.
              </span>
            </h2>
            <div className="mt-6">
              <img 
                src="/src/assets/mugwsachet copy.webp" 
                alt="Custom branded coffee mug and sachets" 
                className="w-full max-w-md mx-auto lg:mx-0 rounded-xl"
              />
            </div>
          </div>
        </div>
        
        {/* Right Side - Devin Larry Photo */}
        <div className="relative overflow-hidden">
          <img 
            src="/src/assets/devin.larry.webp" 
            alt="Professional realtor with coffee" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Pour Ta Coffee. All rights reserved.</p>
          <p className="mt-2">Questions? Contact us at orders@pourtacoffee.com or (555) 123-4567</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
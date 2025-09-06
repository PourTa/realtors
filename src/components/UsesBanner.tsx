// src/components/UsesBanner.tsx
import React from 'react';

// adjust the relative paths as needed
import imgOpenHouses from '../assets/website_assets-01.webp';
import imgClientGifts from '../assets/website_assets-02.webp';
import imgOfficeWelcome from '../assets/website_assets-03.webp';
import imgClosingGifts from '../assets/website_assets-04.webp';

const UsesBanner: React.FC = () => {
  const uses = [
    { image: imgOpenHouses, text: 'Open Houses' },
    { image: imgClientGifts, text: 'Client Gifts' },
    { image: imgOfficeWelcome, text: 'Office Welcome' },
    { image: imgClosingGifts, text: 'Closing Gifts' },
  ];

  return (
    <div className="uses-banner">
      {uses.map((u, i) => (
        <div key={i} className="use">
          <img src={u.image} alt={u.text} />
          <p>{u.text}</p>
        </div>
      ))}
    </div>
  );
};

export default UsesBanner;

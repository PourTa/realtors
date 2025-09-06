import React from "react";

// If you’re using public/ images, use root-relative URLs:
const uses = [
  { image: "/images/website_assets-01.webp", text: "Open Houses" },
  { image: "/images/website_assets-02.webp", text: "Client Gifts" },
  { image: "/images/website_assets-03.webp", text: "Office Welcome" },
  { image: "/images/website_assets-04.webp", text: "Closing Gifts" },
];

const UsesBanner: React.FC = () => {
  return (
    <section className="uses-grid">
      {uses.map((u, i) => (
        <article className="use-card" key={i}>
          <div className="media">
            <img
              src={u.image}
              alt={u.text}
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="caption">{u.text}</p>
        </article>
      ))}
    </section>
  );
};

export default UsesBanner;

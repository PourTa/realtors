import React from "react";

const uses = [
  { image: "/images/website_assets-01.webp", text: "Open Houses" },
  { image: "/images/website_assets-02.webp", text: "Client Gifts" },
  { image: "/images/website_assets-03.webp", text: "Office Welcome" },
  { image: "/images/website_assets-04.webp", text: "Closing Gifts" },
];

const UsesBanner: React.FC = () => {
  return (
    <section className="grid grid-cols-4 gap-4 lg:grid-cols-2 sm:grid-cols-1">
      {uses.map((u, i) => (
        <article key={i} className="flex flex-col items-center">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl">
            <img
              src={u.image}
              alt={u.text}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <p className="mt-2 text-center font-semibold">{u.text}</p>
        </article>
      ))}
    </section>
  );
};

export default UsesBanner;

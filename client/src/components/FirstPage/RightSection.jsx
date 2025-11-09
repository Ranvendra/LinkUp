import { useState } from "react";
import girl from "/model.jpg"; // use optimized image

function RightSection() {
  const [loaded, setLoaded] = useState(false);



  return (
    <div className="relative w-full h-screen overflow-hidden bg-linear-to-bl from-[#cff0ff] via-gray-100 to-gray-100">
      {/* ✅ Placeholder gradient shown instantly */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-bl from-[#d8f6ff] via-gray-100 to-gray-100" />
      )}

      {/* ✅ AOS animates the container, not the image itself */}
      <div
        data-aos="fade-left"
        className="relative w-full h-screen flex items-center justify-center"
      >
        {/* ✅ Lazy image with fade-in */}
        <img
          src={girl}
          alt="Model"
          loading="lazy" // ✅ Lazy loading retained
          onLoad={() => {
            setLoaded(true);
          }}
          className={`w-full h-screen object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}

export default RightSection;

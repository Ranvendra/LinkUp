import { useState } from "react";
import girl from "/model.jpg"; // use optimized image

function RightSection() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-linear-to-bl from-[#d8f2ff] via-gray-100 to-gray-100">
      {/* ✅ Placeholder gradient shown instantly */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-bl from-[#d8f6ff] via-gray-100 to-gray-100" />
      )}

      {/* ✅ Lazy image with fade-in */}
      <img
        src={girl}
        alt="Model"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-screen object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default RightSection;

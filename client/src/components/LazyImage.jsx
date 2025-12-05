import { useState, useEffect } from "react";

const LazyImage = ({ src, alt, className = "", style = {} }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset loaded state when src changes
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder / Skeleton (Optional: can be a solid color or shimmer) */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default LazyImage;

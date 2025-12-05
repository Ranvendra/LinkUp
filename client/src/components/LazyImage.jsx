import { useState, useEffect } from "react";

const LazyImage = ({ src, alt, className = "", style = {}, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true); // Stop loading animation even if error
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder / Skeleton */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Actual Image */}
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading={props.loading || "lazy"} // Default to lazy, allow override
          decoding="async" // decoding off main thread
          referrerPolicy="no-referrer" // avoid hotlink blocks
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      ) : (
        /* Fallback for error */
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LazyImage;

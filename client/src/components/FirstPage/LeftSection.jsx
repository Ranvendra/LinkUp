import React from "react";
import icon from "/icon.webp";
import AuthForms from "./AuthForm";
// import ui from '../../assets/ui.png';

function LeftSection() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-[#ffd8eb] via-gray-100 to-gray-100">
      {/* Header with Logo - Fixed padding and spacing */}
      <header className="p-4 sm:p-6 md:p-3 xl:pl-15">
        <div className="flex items-center">
          <img
            src={icon}
            alt="Linkup Logo"
            className="w-15 h-15 sm:w-10 sm:h-10 lg:w-16 lg:h-16 object-cover md:ml-2"
          />
          <span className="font-pacifico text-2xl sm:text-4xl lg:text-5xl xl:text-5xl pb-6 pr-2 pl-2 pt-2 sm:ml-3 lg:ml-2  mt-4 text-red-500 ">
            Linkup
          </span>
        </div>
      </header>

      <div
        className="
    flex items-center justify-center font-pacifico 
    text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-400
    
    mt-5 pb-5          /* Mobile spacing */
    text-5xl           /* Mobile text size */
    
    md:mt-10 md:pb-10  /* Tablet/Desktop spacing */
    md:text-7xl        /* Tablet text size */
    
    lg:text-8xl        /* Desktop text size */
  "
        data-aos="fade-right"
      >
        Bond Begins
      </div>

      {/* Auth Form Section - Improved spacing and responsiveness */}
      <div className="flex-1 mt-10 flex justify-center xl:justify-start px-4 sm:px-6 lg:px-8 xl:ml-0 xl:pr-40">
        <AuthForms />
        {/* <img className='h-120 w-200 flex items-center justify-center xl:ml-20'
            src={ui}
          /> */}
      </div>
    </div>
  );
}

export default LeftSection;

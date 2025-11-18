import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

function FrontPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Left Side */}
      <div className="w-full lg:w-1/2 min-h-screen lg:rounded-tr-2xl lg:rounded-br-2xl flex-1">
        <LeftSection />
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex w-1/2 flex-1">
        <RightSection/>
      </div>
    </div>
  );
}

export default FrontPage;
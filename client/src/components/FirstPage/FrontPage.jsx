import LeftSection from "./LeftSection";
import RightSection from "./RightSection";

function FrontPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Left Side  */}
      <div className="w-full lg:w-1/2 min-h-screen rounded-tr-2xl rounded-br-2xl flex-11">
        <LeftSection />
      </div>

      {/* Right Side */}
      <div className="flex-11">
        <RightSection/>
      </div>
    </div>
  );
}

export default FrontPage;

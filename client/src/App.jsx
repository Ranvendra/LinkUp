import { useEffect } from "react";

import FrontPage from "./components/FirstPage/FrontPage";
import AOS from "aos";
import "aos/dist/aos.css";


function App() {

    useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: false,     // whether animation should happen only once
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div>
      <FrontPage/>
    </div>
  );
}

export default App;

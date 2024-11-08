import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/Packages/Login/Login";
import Dashboard from "./Pages/Dashboard";
import { Toaster, toast } from "sonner";
import { useLocation } from "react-router-dom";
import Navbar from "@/Navbar/Navbarcomp";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [location.pathname]);
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration" element={<Dashboard />} />
        <Route path="/registrationlist" element={<Dashboard />} />
        <Route path="/holiday" element={<Dashboard />} />
        <Route path="/services" element={<Dashboard />} />
        <Route path="/department" element={<Dashboard />} />
        <Route path="/parameter" element={<Dashboard />} />
        <Route path="/parametergroup" element={<Dashboard />} />
        <Route path="/specimen" element={<Dashboard />} />
        <Route path="/container" element={<Dashboard />} />
        <Route path="/testmaster" element={<Dashboard />} />
        <Route path="/testlinkmaster" element={<Dashboard />} />
        <Route path="/formcomponent" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;

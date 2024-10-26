import React from "react";
import Sidebar from "@/Dashboard/Sidebar";
import Dashboardcomponent from "@/Components/Dashboard/Dashboard";
import Registration from "@/Components/Registration/Registration";
import { useLocation } from "react-router-dom";
// import { RegistrationComponent } from "@/Dashboard/Registration/RegistrationTable";
import Dashboardholiday from "@/Components/Holiday/Registertable";
import DashboardPage from "@/Components/Registration/Dashbordcomp/Registertable";
import Dashboarddepartment from "@/Components/Department/Registertable";
import DashboardServices from "@/Components/Services/Registertable";
import Dashboardparameter from "@/Components/Parameter/Registertable";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  useEffect(() => {
    if (!User?._id) {
      navigate("/");
    }
  }, [location, User]);

  return (
    <div className="flex bg-background w-[100vw] h-full relative min-h-screen">
      <div className="min-h-screen relative top-0 bg-accent/40">
        <Sidebar className="min-h-full" />
      </div>
      <main className="w-full flex-1 overflow-hidden ">
        {location.pathname === "/dashboard" && <Dashboardcomponent />}
        {location.pathname === "/registration" && <Registration />}
        {location.pathname === "/registrationlist" && <DashboardPage />}
        {location.pathname === "/services" && <DashboardServices />}
        {location.pathname === "/holiday" && <Dashboardholiday />}
        {location.pathname === "/department" && <Dashboarddepartment />}
        {location.pathname === "/parameter" && <Dashboardparameter />}
      </main>
    </div>
  );
};

export default Dashboard;

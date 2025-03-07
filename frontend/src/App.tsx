import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/Packages/Login/Login";
import Dashboard from "./Pages/Dashboard";
import { Toaster, toast } from "sonner";
import { useLocation } from "react-router-dom";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
import ClinicalHistory from "./Components/ClinicalHistory/Registertable";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Referencerange from "@/Components/ReferenceRange/TestCard";
import { Icons } from "@/Dashboard/Icon";
import { Editor } from "@/Components/Editor/Editor";
import Navbar from "@/Navbar/Navbarcomp";
import { navItems } from "@/Config/data";
import PaymentDetails from "./Components/Registration/PaymentDetails";
import Innnerfile from "@/Components/SampleCollection/Innersamplecollection";
import { coerce } from "zod";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [location.pathname]);
  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {navItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <CommandGroup heading={item.title}>
                  {item.children?.map((child) => {
                    const Icon = Icons[child.icon || "arrowRight675.  "];
                    const isActive = location.pathname === child.href;

                    return (
                      <div className="flex items-center gap-2 w-full">
                        <CommandItem
                          key={child.title}
                          className="w-full flex items-center gap-2 overflow-hidden rounded-md py-1 text-sm font-medium hover:bg-secondary hover:text-iconActive"
                          onSelect={() => {
                            navigate(child.href);
                            setOpen(false);
                          }}
                        >
                          {Icon && (
                            <Icon className={`ml-3 size-5 flex-none `} />
                          )}

                          {child.title}
                        </CommandItem>
                      </div>
                    );
                  })}
                </CommandGroup>
              );
            }
          })}
        </CommandList>
      </CommandDialog>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration" element={<Dashboard />} />
        <Route path="/registrationlist" element={<Dashboard />} />
        <Route path="/holiday" element={<Dashboard />} />
        {/* <Route path="/services" element={<Dashboard />} /> */}
        <Route path="/service/add" element={<Dashboard />} />
        <Route path="/department" element={<Dashboard />} />
        <Route path="/parameter" element={<Dashboard />} />
        <Route path="/reason" element={<Dashboard />} />
        <Route path="/barcode" element={<Dashboard />} />
        <Route path="/prefix" element={<Dashboard />} />
        <Route path="/highlighter" element={<Dashboard />} />
        <Route path="/parametergroup" element={<Dashboard />} />
        <Route path="/specimen" element={<Dashboard />} />
        <Route path="/container" element={<Dashboard />} />
        <Route path="/testmaster" element={<Dashboard />} />
        <Route path="/testmaster/add" element={<Dashboard />} />
        <Route path="/testmaster/edit/:id" element={<Dashboard />} />
        <Route path="/testlinkmaster" element={<Dashboard />} />
        <Route path="/promocodemaster" element={<Dashboard />} />
        <Route path="/associatemaster" element={<Dashboard />} />
        <Route path="/associatemaster/add" element={<Dashboard />} />
        <Route path="/associatemaster/edit/:id" element={<Dashboard />} />
        <Route path="/corporate" element={<Dashboard />} />
        <Route path="/corporate/add" element={<Dashboard />} />
        <Route path="/corporate/edit/:id" element={<Dashboard />} />
        <Route path="/patientmaster" element={<Dashboard />} />
        <Route path="/patientmaster/add" element={<Dashboard />} />
        <Route path="/patientmaster/edit/:id" element={<Dashboard />} />
        <Route path="/tatmaster" element={<Dashboard />} />
        <Route path="/tatmaster/add" element={<Dashboard />} />
        <Route path="/tatmaster/edit/:id" element={<Dashboard />} />
        <Route path="/formula" element={<Dashboard />} />
        <Route path="/machinemaster" element={<Dashboard />} />
        <Route path="/machinelinkmaster" element={<Dashboard />} />
        <Route path="/containerLinkMaster" element={<Dashboard />} />
        <Route path="/ratecard" element={<Dashboard />} />

        <Route path="/discountmaster" element={<Dashboard />} />
        <Route path="/rolemaster" element={<Dashboard />} />
        <Route path="/assignaccess" element={<Dashboard />} />
        <Route path="/usermaster" element={<Dashboard />} />
        <Route path="/usermaster/add" element={<Dashboard />} />
        <Route path="/usermaster/edit/:id" element={<Dashboard />} />
        <Route path="/service" element={<Dashboard />} />
        <Route path="/labmaster" element={<Dashboard />} />
        <Route path="/autocomplete" element={<Dashboard />} />
        <Route path="/collectionmaster" element={<Dashboard />} />
        <Route path="/collectionmaster/add" element={<Dashboard />} />
        <Route path="/collectionmaster/edit/:id" element={<Dashboard />} />
        <Route path="/registration/patient/add" element={<Dashboard />} />
        <Route path="/registration/referral/add" element={<Dashboard />} />
        <Route path="/samplecollection" element={<Dashboard />} />
        <Route path="/accession" element={<Dashboard />} />
        <Route path="/accession/verification" element={<Dashboard />} />
        <Route path="/workhours" element={<Dashboard />} />
        <Route path="/samplecollection/collect/:id" element={<Dashboard />} />
        <Route path="/registration/payment/:id" element={<PaymentDetails />} />
        <Route path="/referencerange" element={<Dashboard />} />
        <Route path="/branchsetup" element={<Dashboard />} />
        <Route path="/makerchecker" element={<Dashboard />} />
        <Route path="/associatetype" element={<Dashboard />} />
        <Route path="/medicationhistory" element={<Dashboard />} />
        <Route path="/clinic" element={<Dashboard />} />
        <Route path="/clinic/add" element={<Dashboard />} />
        <Route path="/template" element={<Dashboard />} />
        <Route path="/template/add" element={<Dashboard />} />
        <Route path="/template/edit/:id" element={<Dashboard />} />
        <Route path="/paymentmode" element={<Dashboard />} />
        <Route path="/unitmaster" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;

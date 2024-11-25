import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import AlertDialogbox from "./AlertBox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Dashboard({
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  userAvatar = "/placeholder-user.jpg",
}) {
  const barcodeId = "6736f5bf5be3d753757a49ee"; 
  const [formData, setFormData] = useState({
    prefix: "",   
    suffix: "",   
    separator: "",   
    digits: "1", 
    startNumber: "",  
    prefixFor: "patient",
    resetToStart: false,
  });

  const fetchRecord = async (prefixFor) => {
    if (!["sid", "patient", "invoice"].includes(prefixFor)) {
      console.error("Invalid prefixFor value", prefixFor);
      return;
    }

    try {
      const response = await axios.get(`/api/prefix/${prefixFor}`);
      
      if (response.data && response.data.length > 0) {
        const prefixData = response.data[0];
        setFormData({
          prefix: prefixData.prefix || "",
          suffix: prefixData.suffix || "",
          separator: prefixData.separator || "",
          digits: prefixData.digits || "1",
          startNumber: prefixData.startNumber || "",
          prefixFor: prefixData.prefixFor,
          resetToStart: prefixData.resetToStart || false,
        });
      } else {
        setFormData({
          prefix: "",
          suffix: "",
          separator: "",
          digits: "1",
          startNumber: "",
          prefixFor: prefixFor,
          resetToStart: false,
        });
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to fetch prefix configuration");
    }
  };

  useEffect(() => {
    fetchRecord(formData.prefixFor);
  }, [formData.prefixFor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,  
    }));
  };

  const handleDropdownChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      separator: value,   
    }));
  };

  const handleNumberOfDigitsChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      digits: value,  
    }));
  };

  const handlePrefixForChange = (value) => {
    if (value !== "patient" && value !== "sid" && value !== "invoice") {
      console.error("Invalid prefixFor value:", value);
      return;   
    }

    setFormData((prevData) => ({
      ...prevData,
      prefixFor: value,  
    }));
    fetchRecord(value);   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!["patient", "sid", "invoice"].includes(formData.prefixFor)) {
      toast.error("Invalid prefix type");
      return;
    }

    try {
      const response = await axios.get(`/api/prefix/${formData.prefixFor}`);
      
      const payload = {
        ...formData,
        digits: formData.digits.toString(),
      };

      if (response.data && response.data.length > 0) {
        const existingPrefix = response.data[0];
        await axios.put(`/api/prefix/${formData.prefixFor}/${existingPrefix._id}`, payload);
        toast.success("Configuration updated successfully");
      } else {
        await axios.post('/api/prefix', payload);
        toast.success("Configuration saved successfully");
      }
    } catch (error) {
      console.error("Error saving configuration", error);
      toast.error(error.response?.data?.message || "Failed to save configuration");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:px-6">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs?.map((breadcrumb, index) => (
                <BreadcrumbItem key={index}>
                  {breadcrumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card className="bg-accent/40">
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Prefix Setup</CardTitle>
                    <CardDescription>Add/Update the Prefix Configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Prefix For Dropdown */}
                    <div className="mb-4">
                      <label className="mr-4 text-sm font-medium">Prefix For:</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            {formData.prefixFor === "patient" ? "Patient" : formData.prefixFor === "sid" ? "SID" : "InvoiceId"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePrefixForChange("patient")}>
                            Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrefixForChange("sid")}>
                            SID
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrefixForChange("invoice")}>
                            InvoiceId
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Input fields for Prefix and Suffix */}
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label htmlFor="prefix" className="block text-sm font-medium">
                          Prefix
                        </label>
                        <Input
                          type="text"
                          id="prefix"
                          name="prefix"
                          value={formData.prefix || ""}
                          onChange={handleInputChange}
                          placeholder="Enter Prefix"
                        />
                      </div>
                      <div className="col-span-1">
                        <label htmlFor="suffix" className="block text-sm font-medium">
                          Suffix
                        </label>
                        <Input
                          type="text"
                          id="suffix"
                          name="suffix"
                          value={formData.suffix || ""}
                          onChange={handleInputChange}
                          placeholder="Enter Suffix"
                        />
                      </div>
                    </div>

                    {/* Dropdown for Separator and Number of Digits side by side */}
                    <div className="mb-4 flex space-x-4">
                      {/* Separator Dropdown */}
                      <div className="flex-1">
                        <label className="mr-4 text-sm font-medium">Select Separator:</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {formData.separator || " Separator"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDropdownChange(",")}>
                              Comma (,)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDropdownChange("-")}>
                              Hyphen (-)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDropdownChange("/")}>
                              Slash (/)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDropdownChange(":")}>
                              Colon (:)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Number of Digits Dropdown */}
                      <div className="flex-1">
                        <label className="mr-4 text-sm font-medium">Select Number of Digits:</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {formData.digits || "1"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {[1, 2, 3, 4, 5, 6, 7].map((digit) => (
                              <DropdownMenuItem
                                key={digit}
                                onClick={() => setFormData(prev => ({...prev, digits: digit.toString()}))}
                              >
                                {digit}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Input for Start Number */}
                    <div className="mb-4">
                      <label htmlFor="startNumber" className="block text-sm font-medium">
                        Start Number
                      </label>
                      <Input
                        type="number"
                        id="startNumber"
                        name="startNumber"
                        value={formData.startNumber || ""}
                        onChange={handleInputChange}
                        max="99999"  // Enforcing maximum of 5 digits (i.e., 99999)
                        min="0"      // Ensuring only positive numbers are allowed
                        placeholder="Enter Start Number"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

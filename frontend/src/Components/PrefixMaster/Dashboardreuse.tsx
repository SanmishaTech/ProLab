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
    numberOfDigits: 1,  
    startNumber: "",  
    prefixFor: "patient",  
  });

  const fetchRecord = async (prefixFor) => {
    if (prefixFor !== "patient" && prefixFor !== "sid" && prefixFor !== "invoice") {
      console.error("Invalid prefixFor value", prefixFor);
      return; // Return early if the prefixFor is invalid
    }
  
    try {
      // Make GET request to fetch data from the backend based on the prefixFor value
      const response = await axios.get(`/api/prefix/${prefixFor}/${barcodeId}`);
  
      if (response.data && Object.keys(response.data).length > 0) {
        // Only update state if the data received is valid and not empty
        setFormData(response.data); // Populate the formData with the response data
      } else {
        console.log("No data found for", prefixFor);
      }
    } catch (error) {
      // Handle error if request fails
      console.log("Error fetching data", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchRecord(formData.prefixFor); // Fetch data for the selected prefix type (e.g., 'patient', 'sid', 'invoice')
  }, [formData.prefixFor]); // Re-run fetch whenever prefixFor changes

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
      numberOfDigits: value,  
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

    if (formData.prefixFor !== "patient" && formData.prefixFor !== "sid" && formData.prefixFor !== "invoice") {
      console.error("Invalid prefixFor value:", formData.prefixFor);
      toast.error("Invalid prefixFor value");
      return;   
    }

    try {
      // Check if the prefix already exists for the given prefixFor
      const response = await axios.get(`/api/prefix/${formData.prefixFor}/${barcodeId}`);
      if (response.data && Object.keys(response.data).length > 0) {
        // If it exists, update the existing record
        await axios.put(`/api/prefix/${formData.prefixFor}/${barcodeId}`, formData);
        toast.success("Data updated successfully");
      } else {
        // If it doesn't exist, create a new record
        await axios.post(`/api/prefix/${formData.prefixFor}/${barcodeId}`, formData);
        toast.success("Data saved successfully");
      }
    } catch (error) {
      console.error("Error saving data", error);
      toast.error("Failed to save data");
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
                    <CardTitle>Barcode Setup</CardTitle>
                    <CardDescription>Barcode Fields</CardDescription>
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
                              {formData.numberOfDigits || "1"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {[1, 2, 3, 4, 5, 6, 7].map((digit) => (
                              <DropdownMenuItem
                                key={digit}
                                onClick={() => handleNumberOfDigitsChange(digit)}
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
                        Start Number (Up to 5 digits)
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

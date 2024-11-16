import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  File,
  PlusCircle,
  Search,
  Pencil,
  Trash,
  MoreHorizontal,
  ListFilter,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import Edititem from "./Edititem";
import { toast } from "sonner";
export const description =
  "A reusable registrations dashboard with customizable header and table. Configure breadcrumbs, search, tabs, and table data through props.";

export default function Dashboard({
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  userAvatar = "/placeholder-user.jpg",
}) {
  const barcodeId = "673747a38d8ad6d989931206";
  const [formData, setFormData] = useState({
    patientName: false,
    patientId: false,
    sid: false,
    dateOfAppointment: false,
    timeOfAppointment: false,
    testName: false,
    testAbbreviation: false,
    container: false,
  });
  const fetchRecord = async () => {
    try {
      const response = await axios.get(
        `/api/highlighter/reference/${barcodeId}`
      );
      setFormData(response.data);
      console.log("this is stucture", formData);
    } catch (error) {
      console.log("got an error", error);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked, // Update the specific checkbox state
    }));
  };

  const handleColorChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      backgroundColor: value, // Update backgroundColor with the HEX value from the color input
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/highlighter/update/${barcodeId}`, formData);
      toast.success("Data Updated Successfully");
    } catch (error) {
      console.log("Error saving data", error);
      alert("Failed to save data");
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
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <img
                  src={userAvatar}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* {toggleedit && (
          <Edititem
            editid={editid}
            toogleedit={setToggleedit}
            typeofschema={typeofschema}
          />
        )} */}
        {/* Main Content */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card className="bg-accent/40">
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Highlighter Setup</CardTitle>
                    <CardDescription>Highlighter Fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* main checkoboxes */}

                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="col-span-3 flex items-center space-x-5">
                        <div className="flex gap-2">
                          <input
                            type="checkbox"
                            id="useBoldFonts"
                            name="useBoldFonts"
                            checked={formData.useBoldFonts || false}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            htmlFor="useBoldFonts"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Use Bold Fonts
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="checkbox"
                            id="useUnderline"
                            name="useUnderline"
                            checked={formData.useUnderline || false}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            htmlFor="useUnderline"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Use Underline
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="checkbox"
                            id="highLowValues"
                            name="highLowValues"
                            checked={formData.highLowValues || false}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            htmlFor="highLowValues"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Include High Low Values
                          </label>
                        </div>
                      </div>
                      <div className="mt-5 col-span-3 flex items-center space-x-2">
                        <Label
                          htmlFor="sid"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Background Color
                        </Label>
                        <input
                          type="color"
                          id="backgroundColor"
                          name="backgroundColor"
                          value={formData.backgroundColor}
                          onChange={handleColorChange}
                        />
                        <span className="ml-2">{formData.backgroundColor}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            {/* Add more TabsContent as needed */}
          </Tabs>
        </main>
      </div>
    </div>
  );
}

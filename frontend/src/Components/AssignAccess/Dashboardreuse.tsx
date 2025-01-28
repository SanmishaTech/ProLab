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
import { Checkbox } from "@/components/ui/checkbox";
import { SelectGroup, SelectLabel } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  TableCaption,
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
import { useForm } from "react-hook-form";
// import { Label } from "recharts";
// import { Label } from "@/components/ui/label"

<<<<<<< HEAD
=======
import { EmptyState } from "@/components/ui/empty-state";
import {
  FileText,
  MessageSquare,
  Mail,
  Image,
  Files,
  FileQuestion,
  FileSymlink,
  Settings,
} from "lucide-react";

>>>>>>> 7a35450 (asd)
export const description =
  "A reusable registrations dashboard with customizable header and table. Configure breadcrumbs, search, tabs, and table data through props.";

export default function Dashboard({
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  userAvatar = "/placeholder-user.jpg",
}) {
  const barcodeId = "6736f5bf5be3d753757a49ee";
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState(""); // State for selected role

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
  // const fetchRecord = async () => {
  //   try {
  //     const response = await axios.get(`/api/rolemaster/allrole`);
  //     setFormData(response.data);
  //     console.log("this is stucture", formData);
  //   } catch (error) {
  //     console.log("got an error", error);
  //   }
  // };

  const fetchRole = async () => {
    try {
      const response = await axios.get(`/api/rolemaster/allrole`);
      setRole(response.data);
      console.log("this is stucture", role);
    } catch (error) {
      console.log("got an error", error);
    }
  };

  useEffect(() => {
    fetchRole();
    // fetchRecord();
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked, // Update the specific checkbox state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await axios.put(`/api/barcode/update/${barcodeId}`, formData);
      toast.success("Data Updated Successfully");
    } catch (error) {
      console.log("Error saving data", error);
      alert("Failed to save data");
    }
  };
  const handleRoleChange = (value) => {
    setSelectedRole(value); // Update selected role with the selected value
  };

  const invoices = [
    {
      invoice: "patient Master",
    },
    {
      invoice: "Test Master",
    },
    {
      invoice: "Barcode Setup",
    },
    {
      invoice: "Highlighter Master",
    },
    {
      invoice: "Container",
    },
    {
      invoice: "Parameter",
    },
    {
      invoice: "Department",
    },
  ];

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
                    <CardTitle>Access</CardTitle>
                    <CardDescription>Access Fields</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* main checkoboxes */}

                    {/* s */}
                    <div className="flex gap-2 flex-col">
                      <Label htmlFor="email" className="">
                        Select a Role:
                      </Label>
                      <Select
                        value={selectedRole}
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Role</SelectLabel>
                            {role &&
                              role?.map((item) => (
                                <div key={item.id} className="k">
                                  <SelectItem value={item._id}>
                                    {item.role}
                                  </SelectItem>
                                </div>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {/* e */}
                    </div>
                    <div className="df">
                      {/* <div className="overflow-y-auto max-h-[300px]"> */}
                      <Table>
                        <TableCaption>A list of your Modules.</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[500px]">Module</TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Add</TableHead>
                            <TableHead>Edit</TableHead>
                            <TableHead>Delete</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                              <TableCell className="font-medium">
                                {invoice.invoice}
                              </TableCell>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {/* </div> */}
                    </div>
                  </CardContent>
                  <CardFooter className="">
                    <Button className="" type="submit">
                      Save
                    </Button>
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

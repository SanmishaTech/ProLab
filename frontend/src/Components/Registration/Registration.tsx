import React, { useEffect, useState } from "react";
import Topsection from "./Topsection";
import Order from "./Order";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import {
  File,
  PlusCircle,
  Search,
  MoreHorizontal,
  ListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import userAvatar from "@/images/Profile.jpg";
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
import BottomTest from "./BottomTestsection";
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

import { Link } from "react-router-dom";
const Registration = () => {
  const [topComp, setTopComp] = useState();
  const [orderComp, setOrderComp] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("This is topComp", topComp);
  }, [topComp]);

  return (
    <>
      <div className="flex flex-col w-full h-full p-4 bg-background item-center px-8 ml-[2.5rem]  scroll-y-auto">
        <header className="mr-10 mb-4 sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>

                <BreadcrumbPage>Registration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
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
        <Topsection setTopComp={setTopComp} />
        <Middlesection topsection={topComp} />
        <BottomTest setOrderComp={setOrderComp} topComp={topComp} />
      </div>
    </>
  );
};

export default Registration;

const Middlesection = ({ topsection }) => {
  const [patientForm, setPatientForm] = useState();

  useEffect(() => {
    console.log("This is topsectioaasssssssssssssssn", topsection);
    setPatientForm(topsection?.patientId);
  }, [topsection]);

  return (
    <div className="flex w-full h-full px-0 mt-4 bg-background items-center scroll-y-auto gap-5 max-w-6xl ">
      {/* Available Services Card */}
      <Card className="flex-1 bg-accent/40 shadow-md">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Your contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" grid grid-cols-5 gap-4 max-w-6xl ">
            <div className="space-y-2">
              <Label htmlFor="firstName">Country</Label>
              <Input
                id="firstName"
                placeholder="Patient's country"
                value={patientForm?.country}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">State</Label>
              <Input
                id="state"
                placeholder="Patient's country"
                value={patientForm?.state}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">City</Label>
              <Input
                id="firstName"
                placeholder="Patient's City"
                value={patientForm?.city}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Email</Label>
              <Input
                id="firstName"
                placeholder="Patient's City"
                value={patientForm?.email}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">Mobile</Label>
              <Input
                id="firstName"
                placeholder="Patient's Mobile"
                value={patientForm?.mobile}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

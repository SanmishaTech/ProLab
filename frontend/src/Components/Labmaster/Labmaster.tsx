import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Labmaster = () => {
  return (
    <>
      <Card className="bg-accent/40 m-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                First Name:
              </p>
              <Input />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Last Name:
              </p>
              <Input />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Employee Code:
              </p>
              <Input />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                EmailID
              </p>
              <Input />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mobile No:
              </p>
              <Input />
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Card className="bg-accent/40 m-8 mt-2">
        <CardHeader>
          <CardTitle>Address Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select Country:
              </p>
              <Select className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="pakistan">Pakistan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select State:
              </p>
              <Select className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="arunachal-pradesh">
                    Arunachal Pradesh
                  </SelectItem>
                  <SelectItem value="assam">Assam</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                  <SelectItem value="goa">Goa</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="himachal-pradesh">
                    Himachal Pradesh
                  </SelectItem>
                  <SelectItem value="jharkhand">Jharkhand</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="manipur">Manipur</SelectItem>
                  <SelectItem value="meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="mizoram">Mizoram</SelectItem>
                  <SelectItem value="nagaland">Nagaland</SelectItem>
                  <SelectItem value="odisha">Odisha</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="sikkim">Sikkim</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="tripura">Tripura</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                </SelectContent>
              </Select>{" "}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select City:
              </p>
              <Select className="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="nagpur">Nagpur</SelectItem>
                  <SelectItem value="nashik">Nashik</SelectItem>
                  <SelectItem value="aurangabad">Aurangabad</SelectItem>
                </SelectContent>
              </Select>{" "}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Address1 :
              </p>
              <Input />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Address2 :
              </p>
              <Input />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Pin Code:
              </p>
              <Input />
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default Labmaster;

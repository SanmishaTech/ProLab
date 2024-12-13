import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Autocomplete = () => {
  const [formData, setFormData] = useState([]);
  const [input, setInput] = useState("");
  const [defaultcheckbox, setDefaultcheckbox] = useState(false);
  const [abnormal, setAbnormal] = useState(false);

  const addingToArray = (e: any) => {
    //checking if default is unique before adding, There can only be one default if it exists before another default is being attempted to add

    if (input.length === 0) {
      toast.error("Please enter a text");
      return;
    }
    if (formData.filter((item) => item.default).length > 0 && defaultcheckbox) {
      toast.error("Default already exists");
      return;
    }

    setFormData((prevData: any) => [
      ...prevData,
      {
        autocompleteText: input,
        default: defaultcheckbox,
        abnormal: abnormal,
      },
    ]);
    setInput("");
    setDefaultcheckbox(false);
    setAbnormal(false);
  };

  return (
    <>
      <Card className="bg-accent/40 m-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Auto Complete Master</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2 max-w-sm">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                First Name:
              </p>
              <Select>
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
              </Select>
            </div>
            <div className="space-y-2 max-w-lg">
              <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Auto Complete Text:
              </p>
              <Input
                placeholder="Enter Auto Complete Text"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </div>
            <div className="space-y-2 max-w-lg mt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="default"
                    className="text-white"
                    checked={defaultcheckbox}
                    onCheckedChange={(checked) => setDefaultcheckbox(checked)}
                  />
                  <label
                    htmlFor="default"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Default
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="abnormal"
                    checked={abnormal}
                    onCheckedChange={(checked) => setAbnormal(checked)}
                  />
                  <label
                    htmlFor="abnormal"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Abnormal
                  </label>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="space-y-2 max-w-lg mt-2">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-left">Text</TableHead>
                    <TableHead className="text-right">Defauklt</TableHead>
                    <TableHead className="text-right">Abnormal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData &&
                    formData.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="text-left font-medium">
                          {invoice.autocompleteText}
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice.default ? "yes" : "no"}
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice.abnormal ? "yes" : "no"}
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <Button onClick={addingToArray}>Add</Button>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default Autocomplete;

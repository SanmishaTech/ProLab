// components/AddItem.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { now, getLocalTimeZone } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

import axios from "axios";

interface AddItemProps {
  onAdd: (item: any) => void;
  typeofschema: Record<string, any>;
}

const AddItem: React.FC<AddItemProps> = ({ onAdd, typeofschema }) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");

  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/promocodemaster`, formData);
      onAdd(formData); // Notify parent component
      setFormData({});
      setHandleopen(false);
      setError("");
      // window.location.reload();
    } catch (err) {
      setError("Failed to add Promo code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Capitalize the first letter of each word for labels
  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Handle input changes dynamically
  const handleChange = (name: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputChange = (data) => {
    console.log("Data", data);
  };

  // Dynamically render form fields based on the schema
  const addFields = (schema: Record<string, any>) => {
    const allFieldsToRender = [];

    Object.entries(schema).forEach(([key, value]) => {
      const fieldType = value.type;
      const label = value.label || capitalizeText(key);

      switch (fieldType) {
        case "String":
          allFieldsToRender.push(
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {label}
              </Label>
              <Input
                id={key}
                name={key}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                value={formData[key] || ""}
                className="col-span-3"
              />
            </div>
          );
          break;

        case "Number":
          allFieldsToRender.push(
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {label}
              </Label>
              <Input
                id={key}
                name={key}
                type="number"
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                value={formData[key] || ""}
                className="col-span-3"
              />
            </div>
          );
          break;

        // case "Date":
        //   allFieldsToRender.push(
        //     <div key={key} className="flex items-center justify-center  gap-4">
        //       <Label htmlFor={key} className="text-right">
        //         {label}
        //       </Label>
        //       <DatePicker
        //         hideTimeZone
        //         showMonthAndYearPickers
        //         defaultValue={now(getLocalTimeZone())}
        //         label="Event Date"
        //         variant="bordered"
        //         onChange={(value) => {
        //           console.log("Date changed:", value);
        //           handleInputChange(value);
        //         }}
        //       />
        //     </div>
        //   );
        //   break;

        case "Select":
          allFieldsToRender.push(
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {label}
              </Label>
              <Select onValueChange={(value) => handleChange(key, value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder={`Select ${label.toLowerCase()}`}
                    value={formData[key] || ""}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {value.options.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          );
          break;

        // Add this case in the addFields method
        // case "Checkbox":
        //   allFieldsToRender.push(
        //     <div key={key} className="grid grid-cols-4 items-center gap-4">
        //       <Label htmlFor={key} className="text-right">
        //         {label}
        //       </Label>
        //       <div className="col-span-3 flex items-center space-x-2">
        //         <Checkbox
        //           id={key}
        //           checked={formData[key] || false}
        //           onCheckedChange={(checked) => handleChange(key, checked)}
        //         />
        //         <label
        //           htmlFor={key}
        //           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        //         >
        //           {label}
        //         </label>
        //       </div>
        //     </div>
        //   );
        //   break;

        // Add more cases for different field types as needed

        default:
          console.warn(`Unsupported field type: ${fieldType}`);
          break;
      }
    });

    return allFieldsToRender;
  };

  return (
    <Dialog open={handleopen} onOpenChange={setHandleopen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Promo Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Promo Code</DialogTitle>
          <DialogDescription>
            Enter the details of the Promo Code you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}
          {addFields(typeofschema)}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Validity</Label>
            <Input
              id="validity"
              type="date"
              name="validityDate"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder={`Enter Validity`}
              value={formData.validityDate || ""}
              className="col-span-3"
            />
            {/* <div className="w-full max-w-xl flex flex-row gap-4">
              <DatePicker
                label="Collection Time"
                defaultValue={now(getLocalTimeZone())}
                onChange={(value) => {
                  const isoDate = value
                    .toDate(getLocalTimeZone())
                    .toISOString();
                  setData((prev) =>
                    prev.map((item) =>
                      item.invoice === invoice.invoice
                        ? { ...item, dateTime: isoDate }
                        : item
                    )
                  );
                }}
              />
            </div> */}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} type="button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;

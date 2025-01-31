// components/AddItem.tsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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

import axios from "axios";

interface AddItemProps {
  onAdd: (item: {
    id: string;
    name: string;
    unit: string;
    fieldType: string;
  }) => void;
}

const AddItem: React.FC<AddItemProps> = ({
  onAdd,
  typeofschema,
  className,
}) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [SelectedValue, setSelectedValue] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [description, setdescription] = useState("");
  const [formData, setFormData] = useState({});
  const handleAdd = async () => {
    // const service = services.find((s) => s.name === SelectedValue);
    formData.userId = User?._id;
    await axios.post("/api/parameter", formData).then(() => {
      window.location.reload();
    });
    setName("");
    setDate(null);
    // Reset form fields
    setHandleopen(false);
  };

  function capitalizeText(text) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleChange = (name: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlecheckbox = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value, // Directly updating the key with its new value
    }));
  };

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

        case "Date":
          allFieldsToRender.push(
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {label}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData[key] && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2" />
                    {formData[key] ? (
                      format(new Date(formData[key]), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData[key] ? new Date(formData[key]) : null}
                    onSelect={(date) =>
                      handleChange(key, date ? date.toISOString() : null)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          );
          break;

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
        case "Checkbox":
          allFieldsToRender.push(
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {label}
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={formData[key] || false}
                  onCheckedChange={(checked) => handlecheckbox(key, checked)}
                />
                {/* <label
                  htmlFor={key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label> */}
              </div>
            </div>
          );
          break;

        // Add more cases for different field types as needed

        default:
          console.warn(`Unsupported field type: ${fieldType}`);
          break;
      }
    });

    return allFieldsToRender;
  };

  useEffect(() => {
    console.log("className", className);
  }, [className]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Parameters</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Parameters</DialogTitle>
          <DialogDescription>
            Enter the details of the Parameters you want to add to the order.
          </DialogDescription>
        </DialogHeader>
        <div className={cn("grid gap-4 py-4", className)}>
          {error && <p className="text-red-500">{error}</p>}
          {addFields(typeofschema)}
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Namea
            </Label>
            <Input
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              value={name}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Unit
            </Label>
            <Input
              id="name"
              onChange={(e) => setdescription(e.target.value)}
              placeholder="Enter description"
              value={description}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div> */}
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} type="button">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;

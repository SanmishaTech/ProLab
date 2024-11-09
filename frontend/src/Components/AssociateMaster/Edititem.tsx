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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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
import { useParams } from "react-router-dom";
import axios from "axios";

interface AddItemProps {
  onAdd: (item: any) => void;
  typeofschema: Record<string, any>;
  editid: string;
}

const AddItem: React.FC<AddItemProps> = ({
  onAdd,
  typeofschema = {},
  editid,
}) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");

  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editid) {
      axios
        .get(`/api/testmasterlink/reference/${editid}`)
        .then((res) => {
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
    return () => {
      setFormData({});
      setHandleopen(false);
    };
  }, [editid]);
  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios
        .put(`/api/testmasterlink/update/${editid}`, formData)
        .then((res) => {
          console.log("ppaapppppp", res.data);
          // onAdd(res.data.newService);
          setFormData(res.data.newService);
          setHandleopen(false);
          setError("");
        });
    } catch (err) {
      setError("Failed to add parameter group. Please try again.");
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

  // Dynamically render form fields based on the schema
  const addFields = (schema: Record<string, any>) => {
    const allFieldsToRender = [];

    if (!schema || Object.keys(schema).length === 0) {
      return <p>No fields available to display.</p>; // Or handle this case as you prefer
    }

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
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
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

        // case "Checkbox":
        //   allFieldsToRender.push(
        //     <div
        //       style={{ justifyContent: "space-evenly" }}
        //       key={key}
        //       className="flex items-center space-x-4"
        //     >
        //       <Label htmlFor={key}>{label}</Label>

        //       <Checkbox
        //         id={key}
        //         checked={formData[key] || false}
        //         onCheckedChange={(checked) => handleChange(key, checked)}
        //       />
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
        <Button variant="ghost" className="w-full">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
          <DialogDescription>
            Enter the details of the item you want to edit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}
          {addFields(typeofschema)}
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

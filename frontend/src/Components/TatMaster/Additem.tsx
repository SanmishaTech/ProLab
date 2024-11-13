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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import axios from "axios";

interface AddItemProps {
  onAdd: (item: {
    selectTest: string;
    startTime: string;
    endTime: string;
    hoursNeeded: string;
    urgentHours: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  }) => void;
  typeofschema: any; // Add the type for the schema here
}

const AddItem: React.FC<AddItemProps> = ({ onAdd, typeofschema }) => {
  const [SelectedValue, setSelectedValue] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [formData, setFormData] = useState<any>({
    selectTest: "",
    startTime: "",
    endTime: "",
    hoursNeeded: "",
    urgentHours: "",
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/api/testmaster/alltestmaster`);
         setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post("/api/tatmaster", formData);
      window.location.reload();
    } catch (error) {
      setError("Failed to add the item.");
    }
    setHandleopen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addFields = (typeofschema: any) => {
    return Object.entries(typeofschema).map(([key, value]) => {
      if (value === "String") {
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={key}>
            <Label htmlFor={key} className="text-right">
              {capitalizeText(key)}
            </Label>
            <Input
              id={key}
              name={key}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              value={formData[key] || ""}
              className="col-span-3"
            />
          </div>
        );
      }
      return null;
    });
  };

  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add TaT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Turnaround Time</DialogTitle>
          <DialogDescription>
            Enter the details of the TaT you want to add to the order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}

          {/* Dropdown to select test master */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="selectTest" className="text-right">
              Select Test
            </Label>
            <Select
              id="selectTest"
              name="selectTest"
              value={formData.selectTest}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, selectTest: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Test" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checkboxes for each day of the week */}
          <div className="grid gap-4 py-4">
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
              <div className="flex items-center gap-2" key={day}>
                <Checkbox
                  id={day}
                  name={day}
                  checked={formData[day]}
                  onCheckedChange={(checked) => handleChange({ target: { name: day, checked } } as any)}
                />
                <Label htmlFor={day}>{capitalizeText(day)}</Label>
              </div>
            ))}
          </div>

          {/* Dynamically render other input fields based on the typeofschema */}
          {addFields(typeofschema)}
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

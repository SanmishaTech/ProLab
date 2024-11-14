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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import axios from "axios";

const frameworksList = [
  { value: "Sunday", label: "Sunday" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      const second = "00";
      times.push(`${hour}:${minute}:${second}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

interface EditItemProps {
  onEdit: (item: {
    selectTest: string;
    startTime: string;
    endTime: string;
    hoursNeeded: number;
    urgentHours: number;
    weekday: string[];
  }) => void;
  typeofschema: any;
  editId: string;
  fetchData: string;
  closeDialog: () => void;
}

const EditItem: React.FC<EditItemProps> = ({
  onEdit,
  typeofschema,
  editId,
  fetchData,
  closeDialog,
}) => {
  const [formData, setFormData] = useState<any>({
    selectTest: "",
    startTime: "",
    endTime: "",
    hoursNeeded: 0,
    urgentHours: 0,
    weekday: [],
  });
  const [services, setServices] = useState<any[]>([]);  // Ensure services is initialized as an array
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [error, setError] = useState("");
  const item = JSON.parse(localStorage.getItem("item") || "{}");

  useEffect(() => {
     const fetchServices = async () => {
      try {
        const response = await axios.get(`/api/testmaster/alltestmaster/${item?._id}`);
         
      } catch (error) {
        setError("Error fetching services.");
      }
    };

    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`/api/${fetchData}/${editId}`);
         setFormData(response.data);
        setSelectedFrameworks(response.data.weekday);
      } catch (error) {
        setError("Error fetching item details.");
      }
    };
  
    fetchServices();
    fetchItemDetails();
  }, [editId, fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/${fetchData}/${editId}`, formData);
      closeDialog();  // Close the dialog after saving
    } catch (error) {
      setError("Failed to save the item.");
    }
  };

  const addFields = (typeofschema: any) => {
    const fields = [];
    Object.entries(typeofschema).map(([key, value]) => {
      if (value === "String") {
        fields.push(
          <div className="grid grid-cols-4 items-center gap-4" key={key}>
            <Label htmlFor={key} className="text-right">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Input
              id={key}
              name={key}
              value={formData[key] || ""}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className="col-span-3"
            />
          </div>
        );
      }
      return null;
    });
    return fields;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details of the selected item.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}

          {/* Service Selection */}
          <div className="flex items-center gap-4">
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
                {services.length > 0 ? (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service._id}>
                      {service.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>(No services available)</SelectItem> 
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Weekdays Selection */}
          <div className="p-3 max-w-xl flex items-center space-x-4">
            <h1 className="text-sm font-semibold">Selected Days</h1>
            <MultiSelect
              options={frameworksList}
              value={selectedFrameworks}
              onValueChange={(values) => {
                setSelectedFrameworks(values);
                setFormData((prevData) => ({
                  ...prevData,
                  weekday: values.map((value) => value.toLowerCase()),
                }));
              }}
              placeholder="Select Days"
              variant="inverted"
              maxCount={4}
            />
          </div>

          {/* Time Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Select
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, startTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Start Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Select
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, endTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select End Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hours Needed */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="hoursNeeded" className="text-right">
                Hours Needed
              </Label>
              <Input
                id="hoursNeeded"
                name="hoursNeeded"
                type="number"
                value={formData.hoursNeeded}
                onChange={handleChange}
                placeholder="Number of hours"
              />
            </div>

            {/* Urgent Hours */}
            <div className="flex items-center gap-4">
              <Label htmlFor="urgentHours" className="text-right">
                Urgent Hours
              </Label>
              <Input
                id="urgentHours"
                name="urgentHours"
                type="number"
                value={formData.urgentHours}
                onChange={handleChange}
                placeholder="Urgent hours"
              />
            </div>
          </div>

          {/* Dynamic fields from typeofschema */}
          {addFields(typeofschema)}
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItem;

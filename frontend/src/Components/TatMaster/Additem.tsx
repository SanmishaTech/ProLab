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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      // Use 15-minute intervals
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      const second = "00"; // Default to 00 seconds
      times.push(`${hour}:${minute}:${second}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

interface AddItemProps {
  onAdd: (item: {
    selectTest: string;
    startTime: string;
    endTime: string;
    hoursNeeded: number;
    urgentHours: number;
    weekday: string[];
  }) => void;
  typeofschema: any; // Add the type for the schema here
}

const AddItem: React.FC<AddItemProps> = ({ onAdd, typeofschema }) => {
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({
    selectTest: "",
    startTime: "",
    endTime: "",
    hoursNeeded: 0,
    urgentHours: 0,
    weekday: [],
  });
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleAdd = async () => {
    try {
      formData.userId = User?._id;
      await axios.post("/api/tatmaster", formData);
      window.location.reload();
    } catch (error) {
      setError("Failed to add the item.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add TaT</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Turnaround Time</DialogTitle>
          <DialogDescription>
            Enter the details of the TaT you want to add to the order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}

          {/* Dropdown to select test master */}
          <div className="flex items-center gap-4">
            <Label htmlFor="selectTest" className="text-right">
              Select Test
            </Label>
            <Select
              id="selectTest"
              name="selectTest"
              value={formData.selectTest}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, selectTest: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Test" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service) => (
                  <SelectItem key={service.id} value={service._id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weekdays Selection */}
          <div className="p-3 max-w-xl flex items-center space-x-4">
            <h1 className="text-sm font-semibold">Selected Days</h1>
            <MultiSelect
              options={frameworksList}
              onValueChange={(values) => {
                setSelectedFrameworks(values);
                setFormData((prevData: any) => ({
                  ...prevData,
                  weekday: values.map((value) => value.toLowerCase()), // Mapping to lowercase days
                }));
              }}
              placeholder="Select Days"
              variant="inverted"
              maxCount={7}
            />
          </div>

          {/* <div>
            {selectedFrameworks.length > 0 && (
              <>
                <h2 className="text-sm font-semibold">Selected Weekdays:</h2>
                <ul className="list-disc list-inside text-sm">
                  {selectedFrameworks.map((framework) => (
                    <li key={framework}>{framework}</li>
                  ))}
                </ul>
              </>
            )}
          </div> */}

          {/* Start Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Select
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, startTime: value }))
                }
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

            {/* End Time */}
            <div className="flex items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Select
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, endTime: value }))
                }
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

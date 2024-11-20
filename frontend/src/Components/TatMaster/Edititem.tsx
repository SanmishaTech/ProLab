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
import { MultiSelect } from "@/components/ui/multi-select";

import axios from "axios";

interface AddItemProps {
  onAdd: (item: any) => void;
  typeofschema: Record<string, any>;
  editid: string;
}

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

const AddItem: React.FC<AddItemProps> = ({
  onAdd,
  typeofschema = {},
  editid,
}) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");

  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    selectTest: "",
    startTime: "",
    endTime: "",
    hoursNeeded: 0,
    urgentHours: 0,
    weekday: [],
  });
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFrameworks, setSelectedFrameworks] = useState<any[]>([]);

  useEffect(() => {
    // Fetch services for the dropdown
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/api/testmaster/alltestmaster`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();

    // Fetch existing data
    if (editid) {
      axios.get(`/api/tatmaster/reference/${editid}`)
        .then((res) => {
          setFormData({
            ...res.data,
            selectTest: res.data.selectTest?._id
          });
          
          if (res.data.weekday && Array.isArray(res.data.weekday)) {
            const selectedDays = frameworksList.filter(framework => 
              res.data.weekday.includes(framework.value.toLowerCase())
            );
            setSelectedFrameworks(selectedDays);
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [editid]);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios
        .put(`/api/tatmaster/update/${editid}`, formData)
        .then((res) => {
          
          // onAdd(res.data.newService);
          setFormData(res.data);
          setHandleopen(false);
          setError("");
          window.location.reload();
        });
    } catch (err) {
      setError("Failed to add TaT Master. Please try again.");
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
                    <SelectValue
                      placeholder={`Select ${label.toLowerCase()}`}
                      value={formData[key] || ""}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{label}</SelectLabel>
                      {value?.options?.map((option: any) => (
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
          <DialogDescription>
            Enter the details of the item you want to edit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}

          {/* Test Selection Dropdown */}
          <div className="flex items-center gap-4">
            <Label htmlFor="selectTest" className="text-right">
              Select Test
            </Label>
            <Select
              value={formData.selectTest}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, selectTest: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Test" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem 
                    key={service._id} 
                    value={service._id}
                  >
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
              value={selectedFrameworks.map(fw => fw.value)}
              defaultValue={selectedFrameworks.map(fw => fw.value)}
              onValueChange={(values) => {
                const selectedOptions = frameworksList.filter(fw => 
                  values.includes(fw.value)
                );
                setSelectedFrameworks(selectedOptions);
                setFormData(prev => ({
                  ...prev,
                  weekday: values.map(v => v.toLowerCase())
                }));
              }}
              placeholder="Select Days"
              variant="inverted"
              maxCount={7}
            />
          </div>

          {/* Time and Hours Fields */}
          {/* Start Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => handleChange("startTime", value)}
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
                value={formData.endTime}
                onValueChange={(value) => handleChange("endTime", value)}
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

          {/* Hours Fields */}
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
                onChange={(e) => handleChange("hoursNeeded", e.target.value)}
                placeholder="Number of hours"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="urgentHours" className="text-right">
                Urgent Hours
              </Label>
              <Input
                id="urgentHours"
                name="urgentHours"
                type="number"
                value={formData.urgentHours}
                onChange={(e) => handleChange("urgentHours", e.target.value)}
                placeholder="Urgent hours"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} type="button" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;

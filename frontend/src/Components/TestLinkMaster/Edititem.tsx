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
  editid?: string;
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
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  useEffect(() => {
    if (editid) {
      setLoading(true);
      console.log('Fetching data for editid:', editid);
      
      axios
        .get(`/api/testmasterlink/reference/${editid}`)
        .then((res) => {
          console.log('Fetched data:', res.data);
          
          const initialFormData = {
            test: res.data.test?._id,
            parameterGroup: res.data.parameterGroup?._id,
            parameter: res.data.parameter?.map((p: any) => p._id) || []
          };
          
          console.log('Setting initial form data:', initialFormData);
          setFormData(initialFormData);
          
          if (res.data.parameter) {
            const parameterIds = res.data.parameter.map((p: any) => p._id);
            console.log('Setting selected parameters:', parameterIds);
            setSelectedParameters(parameterIds);
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setError(err.response?.data?.message || "Error fetching data");
        })
        .finally(() => {
          setLoading(false);
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
      if (!formData.test || !formData.parameterGroup || !selectedParameters.length) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const updateData = {
        test: formData.test,
        parameterGroup: formData.parameterGroup,
        parameter: selectedParameters,
      };

      if (!editid) {
        setError("No item selected for editing");
        return;
      }

      const response = await axios.put(
        `/api/testmasterlink/update/${editid}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data) {
        // Close dialog and refresh page immediately
        setHandleopen(false);
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current formData:', formData);
    console.log('Current selectedParameters:', selectedParameters);
  }, [formData, selectedParameters]);

  // Capitalize the first letter of each word for labels
  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Handle input changes dynamically
  const handleChange = (name: string, value: any) => {
    console.log(`Handling change for ${name}:`, value);
    setFormData((prevData: any) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log('Updated formData:', newData);
      return newData;
    });
  };
  useEffect(() => {
    const fetchparameter = async () => {
      try {
        const response = await axios.get(`/api/parameter/allparameter`);
        console.log(response.data);
        setSelectedFrameworks(
          response.data.map((framework) => ({
            value: framework?._id,
            label: framework?.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchparameter();
  }, []);

  // Add this useEffect to monitor form data changes
  useEffect(() => {
    console.log('typeofschema:', typeofschema);
    console.log('Current formData:', formData);
  }, [formData, typeofschema]);

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
              <Select 
                value={formData[key] || ''} 
                onValueChange={(value) => {
                  console.log(`Selecting ${key}:`, value);
                  handleChange(key, value);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {value.options?.map((option: any) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                      >
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
            Make changes to your item here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-blue-500 text-sm px-4 py-2 bg-blue-50 rounded">
              Loading...
            </div>
          )}
          {addFields(typeofschema)}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Select Parameters</Label>
            <MultiSelect
              className="col-span-3"
              options={selectedFrameworks}
              onValueChange={(values) => {
                console.log('MultiSelect values changed:', values);
                setSelectedParameters(values);
              }}
              value={selectedParameters}
              defaultValue={selectedParameters}
              placeholder="Select parameters"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleAdd} 
            disabled={loading}
            className={loading ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;

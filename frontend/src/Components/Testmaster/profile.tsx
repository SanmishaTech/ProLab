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

import { MultiSelect } from "@/components/ui/multi-select";

import axios from "axios";

interface AddItemProps {
  onAdd: (item: any) => void;
  typeofschema: Record<string, any>;
}

const MultiSelectorComponent: React.FC<AddItemProps> = ({
  onAdd,
  typeofschema,
  setData,
  defaultValue,
}) => {
  const frameworksList = [
    { value: "react", label: "React" },
    { value: "angular", label: "Angular" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "ember", label: "Ember" },
  ];

  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [handleopen, setHandleopen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState("");
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/api/testmaster/alltestmaster`);
        setSelectedFrameworks(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log("This is formData", formData);
  }, [formData]);
  useEffect(() => {
    setValue(
      selectedFrameworks?.map((framework) => ({
        value: framework._id,
        label: framework.name,
      })) || []
    );
  }, [selectedFrameworks]);

  return (
    <Dialog open={handleopen} onOpenChange={setHandleopen}>
      <DialogTrigger asChild>
        <Button variant="outline">Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Parameter Group</DialogTitle>
          <DialogDescription>
            Enter the details of the Parameter Group you want to add.
          </DialogDescription>
        </DialogHeader>

        <MultiSelect
          options={value}
          onValueChange={setFormData}
          defaultValue={
            Array.isArray(defaultValue)
              ? [
                  defaultValue.map((value) => ({
                    value: value?._id,
                    label: value?.name,
                  })),
                ]
              : defaultValue?.length > 1
              ? [
                  defaultValue.map((value) => ({
                    value: value?._id,
                    label: value?.name,
                  })),
                ]
              : [
                  {
                    label: defaultValue?.name,
                    value: defaultValue?._id,
                  },
                ]
          }
          placeholder="Select frameworks"
          variant="inverted"
          maxCount={5}
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Selected Frameworks:</h2>
          {/* <ul className="list-disc list-inside">
            {console.log(formData)}
            {formData?.map((framework) => (
              <li key={framework._id}>{framework.name}</li>
            ))}
          </ul> */}
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              setHandleopen(false);
              setData(formData);
            }}
            type="button"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MultiSelectorComponent;

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
import FancyMultiSelect from "./Selectcomponent";
import { MultiSelect } from "@/components/ui/multi-select";

import axios from "axios";

interface AddItemProps {
  // other props...
  setData: (data: any) => void;

  defaultValue?: any;
  onDataChange: (data: any) => void;
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
  const [formData, setFormData] = useState<any>([]);
  const [error, setError] = useState("");
  const [tempvalue, settempvalue] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const arayofformids = [];
  useEffect(() => {
    console.log("this is defaultValue", defaultValue);
    if (defaultValue?.profile) {
      const arayofformids = defaultValue?.profile.map(
        (item: any) => item.value
      );
      settempvalue(arayofformids);
    }
  }, [defaultValue]);

  // useEffect(() => {
  //   Object.entries(formData).map(([key, value]) => {
  //     arayofformids.push(value.value);
  //   });
  //   console.log("This is asdasdsadasdsad asdsadasdsad", arayofformids);
  //   setData(arayofformids);
  // }, [formData]);

  useEffect(() => {
    const arayofformids = Object.values(formData).map(
      (item: any) => item.value
    );
    console.log("This is arayofformids", arayofformids);
    settempvalue(arayofformids);
  }, [formData]);

  useEffect(() => {
    if (typeof setData === "function") {
      setData(tempvalue);
    } else {
      console.error("setData is not a function");
    }
  }, [tempvalue, setData]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/api/testmaster/alltestmaster`);
        const filteredData = response.data.map((item: any) => ({
          value: item._id,
          label: item.name,
        }));
        setSelectedFrameworks(filteredData);
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
        <div className="mt-4">
          <h2 className="text-sm font-semibold">Select Tests</h2>
        </div>
        <FancyMultiSelect
          options={selectedFrameworks}
          value={formData}
          onChange={setFormData}
          defaultValue={defaultValue?.profile}
        />
        {/* <MultiSelect
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
        /> */}

        <DialogFooter>
          <Button
            onClick={() => {
              setHandleopen(false);
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

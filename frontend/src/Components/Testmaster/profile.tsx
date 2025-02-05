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
import { MultipleSelect } from "@/components/ui/multiple-select";

import axios from "axios";

interface AddItemProps {
  // other props...
  setData: (data: any) => void;
  existingvalues?: any;
  defaultValue?: any;
  onDataChange: (data: any) => void;
}

const MultiSelectorComponent: React.FC<AddItemProps> = ({
  onAdd,
  typeofschema,
  setData,
  existingvalues,
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
  const [tags, settag] = useState();
  const [tempvalue, settempvalue] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [availableOptions, setAvailableOptions] = useState<any[]>([]);

  const arayofformids = [];
  useEffect(() => {
    console.log("Defaultvalue", defaultValue);
    if (defaultValue?.profile) {
      const arayofformids = defaultValue?.profile.map(
        (item: any) => item.value
      );
      settempvalue(arayofformids);
    }
  }, [defaultValue]);

  useEffect(() => {
    settempvalue(formData);
  }, [formData]);

  useEffect(() => {
    const convertdata = existingvalues?.profile?.map((item: any) => ({
      key: item._id,
      name: item.name,
    }));

    setFormData(convertdata);
  }, [existingvalues]);

  useEffect(() => {
    const initialSelected =
      // defaultValue?.profile?.map((item: any) => item.key) ||
      existingvalues?.profile?.map((item: any) => item.key) || [];
    setSelectedItems(initialSelected);
  }, [defaultValue, existingvalues]);

  useEffect(() => {
    if (existingvalues?.profile && selectedFrameworks.length > 0) {
      const filteredFrameworks = selectedFrameworks.filter(
        (framework) =>
          !existingvalues.profile.some(
            (existing: any) => existing.value === framework._id
          )
      );
      settag(filteredFrameworks);
    }
  }, [existingvalues, selectedFrameworks]);

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
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        const fetchedData = response.data.map((item: any) => ({
          key: item._id,
          name: item.name,
        }));

        // Filter out items that have already been selected (existing values)
        const filteredData = fetchedData.filter(
          (item) => !existingvalues?.profile?.includes(item.key)
        );

        setAvailableOptions(filteredData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [User]);

  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleSelectChange = (selected: any[]) => {
    // Update selected items state (which might be a union of default and newly selected items)
    const newSelected = selected.map((item) => item.key);
    setSelectedItems(newSelected);
    // If you want to update available options to exclude the newly selected ones:
    setAvailableOptions((prevOptions) =>
      prevOptions.filter((option) => !newSelected.includes(option.key))
    );
    setData(newSelected);
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
        <Button className="min-w-[20rem] " variant="outline">
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Test Master</DialogTitle>
          <DialogDescription>
            Enter the details of the Test Master you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h2 className="text-sm font-semibold">Select Tests</h2>
        </div>
        <MultipleSelect
          tags={availableOptions} // Only items that haven't been selected
          // value={selectedItems} // Currently selected items (default + newly added)
          width="550px"
          onChange={handleSelectChange}
          defaultValue={existingvalues?.profile}
          placeholder="Select Tests"
        />
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

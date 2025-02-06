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
import { Button } from "@/components/ui/button";
import { MultipleSelect } from "@/components/ui/multiple-select";
import axios from "axios";

interface AddItemProps {
  setData: (data: any) => void;
  existingvalues?: any;
  onDataChange: (data: any) => void;
  currentTestId?: string; // Add this prop to receive the current test ID
}

const MultiSelectorComponent: React.FC<AddItemProps> = ({
  setData,
  existingvalues,
  onDataChange,
  currentTestId,
}) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [handleopen, setHandleopen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [allOptions, setAllOptions] = useState<any[]>([]);
  // Initialize selected items for edit mode
  useEffect(() => {
    if (existingvalues?.profile) {
      const formattedExisting = existingvalues.profile.map((item: any) => ({
        key: item._id,
        name: item.name,
      }));
      setSelectedItems(formattedExisting);
    }
  }, [existingvalues]);

  // Fetch all available options
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        // Filter out the current test and transform the data
        const fetchedData = Array.isArray(response.data)
          ? response.data
              .filter((item: any) => item._id !== currentTestId) // Filter out current test
              .map((item: any) => ({
                key: item._id,
                name: item.name,
              }))
          : [];
        console.log("Fetched options:", fetchedData);
        setAllOptions(fetchedData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    if (User?._id) fetchServices();
  }, [User?._id, currentTestId]); // Add currentTestId to dependencies

  // Compute available options
  const getAvailableOptions = () => {
    const selectedIds = new Set(selectedItems.map((item) => item.key));
    const filtered = allOptions.filter((item) => !selectedIds.has(item.key));
    console.log("Selected IDs:", selectedIds); // Debug log
    console.log("Filtered options:", filtered); // Debug log
    return filtered;
  };

  // Update parent component
  useEffect(() => {
    if (typeof setData === "function") {
      setData(selectedItems.map((item) => item.key));
    }
  }, [selectedItems, setData]);
  return (
    <Dialog open={handleopen} onOpenChange={setHandleopen}>
      <DialogTrigger asChild>
        <Button className="min-w-[20rem]" variant="outline">
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
          tags={getAvailableOptions()}
          value={selectedItems}
          width="550px"
          onChange={(value) => {
            console.log("Selection changed:", value); // Debug log
            setSelectedItems(value);
          }}
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

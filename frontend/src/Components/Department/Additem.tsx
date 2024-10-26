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

import axios from "axios";

interface AddItemProps {
  onAdd: (item: {
    id: string;
    name: string;
    description: string;
    userId: string;
  }) => void;
}

const AddItem: React.FC<AddItemProps> = ({ onAdd }) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [SelectedValue, setSelectedValue] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [description, setdescription] = useState("");
  const handleAdd = async () => {
    console.log("Name", name);
    console.log("Date", date);
    // const service = services.find((s) => s.name === SelectedValue);
    await axios
      .post("/api/department", {
        name: name,
        description: description,
        userId: User?._id,
      })
      .then(() => {
        window.location.reload();
      });
    setName("");
    setDate(null);
    // Reset form fields
    setHandleopen(false);
  };

  return (
    <Dialog open={handleopen} onOpenChange={(open) => setHandleopen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setHandleopen(true)}>
          Add Holiday
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Holiday</DialogTitle>
          <DialogDescription>
            Enter the details of the Holiday you want to add to the order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              value={name}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Description
            </Label>
            <Input
              id="name"
              onChange={(e) => setdescription(e.target.value)}
              placeholder="Enter description"
              value={description}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd} type="button">
            Add Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItem;

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
    price: number;
    durationindays: number;
    urgentduration: number;
    urgent: boolean;
  }) => void;
}

const AddItem: React.FC<AddItemProps> = ({ onAdd }) => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [SelectedValue, setSelectedValue] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [durationindays, setdurationindays] = useState(0);
  const [urgentduration, seturgentduration] = useState(0);
  const [urgentprice, seturgentprice] = useState(0);
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [price, setPrice] = useState(0);
  const handleAdd = async () => {
    console.log("Name", name);
    // const service = services.find((s) => s.name === SelectedValue);
    await axios
      .post("/api/services", {
        name: name,
        description: description,
        price: price,
        userId: User?._id,
        durationInDays: durationindays,
        urgentDuration: urgentduration,
        urgentPrice: urgentprice,
      })
      .then(() => {
        window.location.reload();
      });
    setName("");
    // Reset form fields
    setHandleopen(false);
  };

  return (
    <Dialog open={handleopen} onOpenChange={(open) => setHandleopen(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setHandleopen(true)}>
          Add Services
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Enter the details of the Service you want to add to the order.
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
              value={description}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="name"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Duration
            </Label>
            <Input
              id="name"
              onChange={(e) => setdurationindays(e.target.value)}
              value={durationindays}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Urgent Duration
            </Label>
            <Input
              id="name"
              onChange={(e) => seturgentduration(e.target.value)}
              value={urgentduration}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Urgentprice
            </Label>
            <Input
              id="name"
              onChange={(e) => seturgentprice(e.target.value)}
              value={urgentprice}
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

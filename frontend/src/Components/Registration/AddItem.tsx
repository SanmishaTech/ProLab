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
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setSelectedValue("");

        const response = await axios.get(
          `/api/services/allservices/${User?._id}`
        );

        setServices(
          response.data.map((service: any) => ({
            id: service?._id,
            name: service.name,
            price: service.price,
            durationInDays: service.durationInDays,
            urgentDuration: service.urgentDuration,
            urgentPrice: service.urgentPrice,
          }))
        );
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [User?._id]);

  const handleAdd = () => {
    if (!SelectedValue.trim()) {
      setError("Service name is required.");
      return;
    }

    const service = services.find((s) => s.name === SelectedValue);
    if (!service) {
      setError("Please select a valid service.");
      return;
    }
    setTimeout(() => {
      setHandleopen(false);
      setError("");

      setSelectedValue("");
    }, 100);
    onAdd({
      id: service.id,
      name: service.name,
      price: service.price,
      urgentPrice: service.urgentPrice,
      durationInDays: service.durationInDays,
      urgentDuration: service.urgentDuration,
      urgent: false, // Set default urgency to false
    });

    // Reset form fields
    setSelectedValue("");
    setError("");
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
            <Label htmlFor="service-name" className="text-right">
              Name
            </Label>
            <Select
              value={SelectedValue}
              onValueChange={(value) => setSelectedValue(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Services</SelectLabel>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              disabled
              id="price"
              value={
                services.find((s) => s.name === SelectedValue)?.price || ""
              }
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

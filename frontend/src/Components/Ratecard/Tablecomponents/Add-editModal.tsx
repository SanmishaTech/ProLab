"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Field<T> {
  key: keyof T;
  label: string;
  type: string;
}

interface AddEditModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: T) => void;
  item?: T;
  fields: Field<T>[];
}

function AddEditModal<T extends object>({
  isOpen,
  onClose,
  onSave,
  item,
  fields,
}: AddEditModalProps<T>) {
  const [formData, setFormData] = React.useState<Partial<T>>(item || {});

  React.useEffect(() => {
    setFormData(item || {});
  }, [item]);

  const handleChange = (key: keyof T, value: any) => {
    const processedValue = ["number", "tel"].includes(fields.find(f => f.key === key)?.type || "") 
      ? Number(value) 
      : value;
      
    setFormData((prev) => ({ ...prev, [key]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as T);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit" : "Add"} Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.key as string} className="mb-4">
              <Label htmlFor={field.key as string}>{field.label}</Label>
              <Input
                id={field.key as string}
                type={field.type}
                value={(formData[field.key] as string) || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEditModal;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AutocompleteData {
  id?: number;
  parameterId: number;
  parameterName: string;
  autocompleteText: string;
  message: string;
  default: boolean;
  abnormal: boolean;
}

interface Parameter {
  id: number;
  name: string;
}

const Autocomplete = () => {
  const [formData, setFormData] = useState<AutocompleteData[]>([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [defaultCheckbox, setDefaultCheckbox] = useState(false);
  const [abnormal, setAbnormal] = useState(false);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // Track which item is being edited

  const User = JSON.parse(localStorage.getItem("user") || "{}");
  // Fetch parameters from API
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/parameter/allparameter/${User?._id}`,
        );
        setParameters(response.data);
      } catch (error) {
        toast.error("Failed to fetch parameters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParameters();
  }, []);

  // Fetch existing autocomplete data
  useEffect(() => {
    if (!selectedParameter) return;
    console.log("prarmeter", selectedParameter);
    const fetchAutocompleteData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/autocomplete/allautocomplete/${selectedParameter}/${User?._id}`,
        );
        console.log("Formdata", response.data);
        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to fetch autocomplete data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutocompleteData();
  }, [selectedParameter]);

  const resetForm = () => {
    setInput("");
    setMessage("");
    setDefaultCheckbox(false);
    setAbnormal(false);
    setSelectedParameter("");
    setEditingId(null); // Reset editing state
  };

  const handleEdit = (item: AutocompleteData) => {
    setInput(item.autocompleteText);
    setMessage(item.message);
    setDefaultCheckbox(item.defaultValue);
    setAbnormal(item.abnormal);
    console.log("selectedprama", item);
    setSelectedParameter(item.parameterId?._id);
    setEditingId(item._id); // Set the editing ID
  };

  const handleUpdate = async () => {
    if (!input?.trim() || !selectedParameter || !message?.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedParam = parameters.find((p) => p._id === selectedParameter);

    const updateData = {
      parameterId: selectedParam?._id,
      parameterName: selectedParam?.name || "",
      autocompleteText: input,
      message: message,
      defaultValue: defaultCheckbox,
      abnormal: abnormal,
      userId: User?._id,
    };

    try {
      setIsSaving(true);
      const response = await axios.put(
        `/api/autocomplete/update/${editingId}`,
        updateData,
      );

      // Update the formData state with the edited item
      setFormData((prev) =>
        prev.map((item) => (item._id === editingId ? response.data : item)),
      );

      toast.success("Data updated successfully");
      resetForm();
    } catch (error) {
      toast.error("Failed to update data");
    } finally {
      setIsSaving(false);
    }
  };

  const addingToArray = async () => {
    if (!input.trim()) {
      toast.error("Please enter autocomplete text");
      return;
    }

    if (!selectedParameter) {
      toast.error("Please select a parameter");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (formData.some((item) => item.default) && defaultCheckbox) {
      toast.error("Default already exists");
      return;
    }

    const selectedParam = parameters.find((p) => p._id === selectedParameter);
    console.log(selectedParam);

    const newData = {
      parameterId: selectedParam?._id,
      parameterName: selectedParam?.name || "",
      autocompleteText: input,
      message: message,
      defaultValue: defaultCheckbox,
      abnormal: abnormal,
      userId: User?._id,
    };

    try {
      setIsSaving(true);
      const response = await axios.post("/api/autocomplete", newData);
      setFormData((prev) => [...prev, response.data]);
      toast.success("Data added successfully");
      resetForm();
    } catch (error) {
      toast.error("Failed to save data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="bg-accent/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Auto Complete Master
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Parameter Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Parameter</label>
              <Select
                onValueChange={setSelectedParameter}
                value={selectedParameter}
              >
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue placeholder="Select Parameter" />
                </SelectTrigger>
                <SelectContent>
                  {parameters.map((param) => (
                    <SelectItem key={param._id} value={param._id}>
                      {param.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto Complete Text Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Auto Complete Text</label>
              <Input
                className="max-w-lg"
                placeholder="Enter Auto Complete Text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                className="max-w-lg"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="default"
                  defaultValue={formData.defaultValue}
                  checked={defaultCheckbox}
                  onCheckedChange={(checked) =>
                    setDefaultCheckbox(checked as boolean)
                  }
                />
                <label htmlFor="default" className="text-sm font-medium">
                  Default
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="abnormal"
                  checked={abnormal}
                  onCheckedChange={(checked) => setAbnormal(checked as boolean)}
                />
                <label htmlFor="abnormal" className="text-sm font-medium">
                  Abnormal
                </label>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>Parameter</TableHead> */}
                    {/* <TableHead>Text</TableHead> */}
                    <TableHead>Message</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Abnormal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <Loader2 className="animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : formData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    formData.length > 0 &&
                    formData?.map((item, index) => (
                      <TableRow key={index}>
                        {/* <TableCell>{item.parameterName}</TableCell> */}
                        {/* <TableCell>{item.autocompleteText}</TableCell> */}
                        <TableCell>{item.message}</TableCell>
                        <TableCell>{item.default ? "Yes" : "No"}</TableCell>
                        <TableCell>{item.abnormal ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Add Button */}
            <div className="flex gap-4">
              <Button
                onClick={editingId ? handleUpdate : addingToArray}
                disabled={isSaving}
                className="w-full max-w-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : editingId ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="w-full max-w-sm"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Autocomplete;

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  useDisclosure,
} from "@heroui/react";

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
import { FilePenLine } from "lucide-react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface AddItemProps {
  onAdd: (item: any) => void;
  typeofschema: Record<string, any>;
  editid: string;
}

export default function App({
  isOpen,
  onClose,
  onOpen,
  editid,
  typeofschema,
  editfetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");

  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState("");
  const [handleopen, setHandleopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Fetching id", editid);
    if (editid) {
      axios
        .get(`/api/clinic/reference/${editid}`)
        .then((res) => {
          setFormData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
    return () => {
      setFormData({});
      setHandleopen(false);
    };
  }, [editid, isOpen]);
  const handleAdd = async () => {
    setLoading(true);
    try {
      formData.userId = User?._id;
      await axios.put(`/api/clinic/update/${editid}`, formData).then((res) => {
        console.log("ppaapppppp", res.data);
        // onAdd(res.data.newService);
        // setFormData(res.data);
        queryClient.invalidateQueries({ queryKey: ["clinic"] });
        onClose();
        setHandleopen(false);
        setError("");
        // window.location.reload();
      });
    } catch (err) {
      setError("Failed to add parameter group. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Capitalize the first letter of each word for labels
  function capitalizeText(text: string) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Handle input changes dynamically
  const handleChange = (name: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
              <Select onValueChange={(value) => handleChange(key, value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {value.options.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          );
          break;
        case "Checkbox":
          allFieldsToRender.push(
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {label}
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={formData[key] || false}
                  onCheckedChange={(checked) => handleChange(key, checked)}
                />
                <label
                  htmlFor={key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            </div>
          );
          break;

        // Add more cases for different field types as needed

        default:
          console.warn(`Unsupported field type: ${fieldType}`);
          break;
      }
    });

    return allFieldsToRender;
  };

  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit</ModalHeader>
              <ModalBody>
                <div className="grid gap-4 py-4">
                  {error && <p className="text-red-500">{error}</p>}
                  {addFields(typeofschema)}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAdd} disabled={loading}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

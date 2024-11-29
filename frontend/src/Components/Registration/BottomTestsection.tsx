// components/Order.tsx

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  Truck,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Dashboard from "./TableComp";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import ApiDrivenInputWithSuggestions from "./AutoTestcomponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddItem from "./AddItem";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
  price: number;
  urgentPrice: number;
  quantity: number;
  urgent: boolean;
  durationindays: number;
  urgentduration: number;
}

interface OrderProps {
  setOrderComp: (comp: any) => void;
  topComp: {
    patientId: string;
    referralId: string;
    // ... other fields if any
  };
}

const Order: React.FC<OrderProps> = ({ setOrderComp, topComp }) => {
  console.log("This is topComp", topComp);
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [upiNumber, setUpiNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState(""); // For CC/DC
  const [paidAmount, setPaidAmount] = useState("");
  const user = localStorage.getItem("user");
  const User = user ? JSON.parse(user) : null;
  const [bottomSection, setBottomSection] = useState([]);
  const [filteredData, setFilteredData] = useState<any[]>([]); // State for filtered data
  const [filterValue, setFilterValue] = useState<string>(""); // Store selected filter value
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [AddTestTable, setAddTestTable] = useState([]);

  useEffect(() => {
    console.log("This is bottomSection", bottomSection);
  }, [bottomSection]);
  console.log("this is a item", items);
  // Function to add a new item
  const addItem = (newItem: Item) => {
    console.log("New Item", newItem);
    console.log("this is a item", items);
    // Check if the service already exists in the order
    const existingItemIndex = items.findIndex((item) => item.id === newItem.id);

    if (existingItemIndex !== -1) {
      // Service exists, increment its quantity
      toast.warning("This Test already exists");
      // const updatedItems = [...items];
      // updatedItems[existingItemIndex].quantity += 1;
      // setItems(updatedItems);
    } else {
      // Service does not exist, add it with quantity 1
      setItems([...items, { ...newItem, quantity: 1 }]);
      setOrderComp([...topComp, newItem.id]); // Assuming setOrderComp needs service IDs
    }
  };

  // Function to toggle urgency
  const toggleUrgent = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, urgent: !item.urgent } : item
      )
    );
  };

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    console.log("this is a item in calcuate", items);
    return items.reduce((total, item) => {
      console.log("this is a item in reduce", total);
      const pricePerUnit = item.urgent ? item.urgentPrice : item.price;
      const itemTotal = Number(pricePerUnit) * Number(item.quantity);
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  // const shipping = 5; // Adjust as needed
  // const tax = Math.round(calculateSubtotal() * 0.08 * 100) / 100;
  const total = calculateSubtotal();

  // Function to calculate completionDays
  const calculateCompletionDays = () => {
    const durations = items.map((item) =>
      item.urgent ? item.urgentDuration : item.durationInDays
    );
    return durations.length ? Math.max(...durations) : 0;
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Please add at least one service to the order.");
      return;
    }

    const numericPaidAmount = Number(paidAmount);
    if (isNaN(numericPaidAmount) || numericPaidAmount < 0) {
      toast.error("Please enter a valid amount paid.");
      return;
    }

    // Validate paymentMode specific fields
    if (paymentMode === "UPI" && !upiNumber.trim()) {
      toast.error("Please enter a valid UPI Number.");
      return;
    }

    if (paymentMode === "CC/DC" && !referenceNumber.trim()) {
      toast.error("Please enter a valid Reference Number.");
      return;
    }

    // Prepare services with urgency flags
    const servicesWithUrgency = items.map((item) => ({
      serviceId: item.id,
      urgent: item.urgent,
    }));

    try {
      const response = await axios.post("/api/registration", {
        patientId: topComp?.patientId,
        referral: topComp?.referralId,
        services: servicesWithUrgency,
        paymentMode: {
          paymentMode: paymentMode,
          paidAmount: numericPaidAmount,
          upiNumber: paymentMode === "UPI" ? upiNumber : undefined,
          referenceNumber:
            paymentMode === "CC/DC" ? referenceNumber : undefined,
        },
        userId: User?._id,
        // Remove completionDays as it's calculated on the backend
      });

      console.log(response.data);
      toast.success("Registration created successfully!");
      navigate("/registrationlist");
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      toast.error(
        error.response?.data?.error || "Failed to submit registration."
      );
    }
  };

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/patientmaster/allpatients/${User?._id}`)
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      });

    // Define the dashboard configuration
    setConfig({
      tableColumns: {
        title: "Patient Master",
        description: "Manage Patient Master and view their details.",
        headers: [
          { label: "Test Abbvr", key: "firstName" },
          { label: "Test Name", key: "middleName" },
          { label: "TAT", key: "lastName" },
          { label: "Urgent Date & Time", key: "mobile" },
          { label: "Outsourced", key: "Outsourced" },
          { label: "Price", key: "Price" },
          { label: "Action", key: "action" },
        ],
        actions: [
          { label: "Edit", value: "edit" },
          { label: "Delete", value: "delete" },
        ],
        pagination: {
          from: 1,
          to: 10,
          total: 32,
        },
      },
    });
  }, [User?._id]);

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData = filteredData
    ? filteredData?.map((item) => {
        console.log("This is item", item);
        return {
          _id: item?._id,
          firstName: item?.firstName || "First Name not provided",
          middleName: item?.middleName || "Middle Name not provided",
          lastName: item?.lastName || "Last Name not provided",
          mobile: item?.mobile || "Mobile not provided",
          delete: `/patientmaster/delete/${item?._id}`,
          action: "actions", // Placeholder for action buttons
          // Additional fields can be added here
        };
      })
    : [];

  useEffect(() => {
    console.log("This is bottomSection", bottomSection);
    if (AddTestTable?.length === 0) {
      setAddTestTable(bottomSection);
      return;
    }
    setAddTestTable([...AddTestTable, bottomSection]);
  }, [bottomSection]);

  return (
    <div className="flex w-full h-full px-0 mt-4 bg-background items-center scroll-y-auto gap-5 ">
      {/* Available Services Card */}
      <Card className="w-full h-full bg-accent/30 shadow-lg max-w-6xl">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Test Details</CardTitle>
            <AddItem onAdd={addItem} />
          </div>
          <CardDescription>Add or remove Test for your patient</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Select Test</Label>
            <ApiDrivenInputWithSuggestions setPatientForm={setBottomSection} />
          </div>
          <ScrollArea className="h-[30rem] w-full rounded-md ">
            <Dashboard
              tableColumns={config?.tableColumns}
              tableData={mappedTableData}
            />
          </ScrollArea>
          {/* Payment Mode */}
          <Card className="mt-2 bg-accent/10 shadow-lg">
            <CardHeader>
              <CardTitle>Payment Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Select
                    value={paymentMode}
                    onValueChange={(value) => setPaymentMode(value)}
                  >
                    <SelectTrigger
                      id="paymentMode"
                      aria-label="Select payment mode"
                    >
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="CC/DC">CC/DC Cards</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(paymentMode === "CC/DC" || paymentMode === "UPI") && (
                  <div className="grid gap-4">
                    <div className="font-semibold">
                      {paymentMode === "CC/DC"
                        ? "Reference Number"
                        : "UPI Number"}
                    </div>
                    <Input
                      type="text"
                      placeholder={
                        paymentMode === "CC/DC"
                          ? "Enter Reference Number"
                          : "Enter UPI Number"
                      }
                      value={
                        paymentMode === "CC/DC" ? referenceNumber : upiNumber
                      }
                      onChange={(e) =>
                        paymentMode === "CC/DC"
                          ? setReferenceNumber(e.target.value)
                          : setUpiNumber(e.target.value)
                      }
                    />
                  </div>
                )}
                <div className="grid gap-4">
                  <div className="font-semibold">Amount Paid</div>
                  <Input
                    type="number"
                    placeholder="Enter Amount Paid"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default Order;

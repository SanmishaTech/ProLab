// components/Order.tsx

import React, { useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
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

  // Function to increment quantity
  const incrementQuantity = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to decrement quantity
  const decrementQuantity = (id: string) => {
    setItems(
      items
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
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

  return (
    <div className="flex w-full h-full px-0 mt-4 bg-background items-center scroll-y-auto gap-5 ">
      {/* Available Services Card */}
      <Card className="min-w-[60%] h-full bg-accent/30 shadow-lg">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Available Services</CardTitle>
            <AddItem onAdd={addItem} />
          </div>
          <CardDescription>
            Add or remove services from your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[30rem] w-full rounded-md border">
            <Table className="bg-background/60">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Urgent Price</TableHead>
                  {/* <TableHead>Quantity</TableHead> */}
                  <TableHead>Urgent</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>&#x20b9;{item.price?.toFixed(2)}</TableCell>
                    <TableCell>
                      &#x20b9;{item.urgentPrice?.toFixed(2)}
                    </TableCell>
                    {/* <TableCell>{item.quantity}</TableCell> */}
                    <TableCell>
                      <Checkbox
                        checked={item.urgent}
                        onCheckedChange={() => toggleUrgent(item.id)}
                      />
                    </TableCell>
                    {/* <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decrementQuantity(item.id)}
                        className="mr-2"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => incrementQuantity(item.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {/* Order Summary Card */}
      <Card className="overflow-hidden bg-light shadow-lg">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>
              Date: {new Date().toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                Track Order
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <MoreVertical className="h-3.5 w-3.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Trash</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm ">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {item.name} x {item.quantity}{" "}
                    {item.urgent && (
                      <span className="text-red-500">(Urgent)</span>
                    )}
                  </span>
                  <span>
                    &#x20b9;
                    {(
                      (item.urgent ? item.urgentPrice : item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>&#x20b9;{calculateSubtotal().toFixed(2)}</span>
              </li> */}
              {/* <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>&#x20b9;{shipping.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>&#x20b9;{tax.toFixed(2)}</span>
              </li> */}
              <li className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>&#x20b9;{total.toFixed(2)}</span>
              </li>
              {/* Display Completion Days */}
              <li className="flex items-center justify-between font-semibold">
                <span>Estimated Days</span>
                <span>{calculateCompletionDays()} day(s)</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated{" "}
            <time dateTime={new Date().toISOString()}>
              {new Date().toLocaleDateString()}
            </time>
          </div>
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
        <CardFooter className="flex flex-row items-center border-t py-3">
          <div className="flex w-full justify-end m-2">
            <Button onClick={handleSubmit}>Register</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Order;

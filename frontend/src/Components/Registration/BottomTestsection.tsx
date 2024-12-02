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
  TableFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";

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
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [discounts, setDiscounts] = useState([]);
  const [discountarray, setdiscountarray] = useState([]);
  const [discountType, setDiscountType] = useState("");
  const [calculatedprice, setcalculatedprice] = useState(0);
  const [subtotalPrice, setSubtotalPrice] = useState(0);
  const [associates, setAssociates] = useState([]);
  const [homevisit, setHomevisit] = useState(0);
  const [homevisitPricetotal, setHomevisitPricetotal] = useState(0);
  const [homevisitcharge, sethomevisitcharge] = useState("");
  const [paymentmodeprice, setpaymentmodeprice] = useState(false);
  const [paymentDeliverymode, setPaymentDeliverymode] = useState([]);

  const frameworksList = [
    { value: "sms", label: "Sms" },
    { value: "whatsapp", label: "Whatsapp" },
    { value: "email", label: "Email" },
  ];

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

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/associatemaster/allassociates/${User?._id}`)
      .then((response) => {
        setAssociates(response.data);
        console.log("This is associates", response.data);
      });
  }, [User?._id]);

  useEffect(() => {
    console.log("This is bottomSection", bottomSection);
    // fetch discounts
    axios
      .get(`/api/discountmaster/alldiscount/${User?._id}`)
      .then((response) => {
        console.log("This is response discount", response.data);
        setDiscounts(response.data);
      });
  }, []);

  const calculateDiscount = () => {
    // match value for discount and calculate actual discount using total amount
    const discounted = calculatedprice - Number(discountType);
    setSubtotalPrice(discounted);
    console.log("This is value discount", discountType);
    console.log("This is totalprice", calculatedprice);
  };
  useEffect(() => {
    calculateDiscount();
  }, [discountType, calculatedprice]);

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
    // discounted price total
    console.log("This is subtotalPrice", homevisit);

    const visitingprice = Number(subtotalPrice) + Number(homevisit);
    setHomevisitPricetotal(visitingprice);
  }, [homevisit, subtotalPrice]);

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
        headers: [
          { label: "Test Abbvr", key: "one" },
          { label: "Test Name", key: "two" },
          { label: "TAT", key: "three" },
          { label: "Urgent Date & Time", key: "four" },
          { label: "Outsourced", key: "five" },
          { label: "Price", key: "six" },
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
  const mappedTableData =
    AddTestTable &&
    AddTestTable?.map((item) => {
      console.log("This is item", item);
      return {
        _id: item?._id,
        one: item?.abbrivation || "First Name not provided",
        two: item?.name || "Middle Name not provided",
        three: item?.lastName || "Last Name not provided",
        four: item?.mobile || "Mobile not provided",
        five: item?.Outsourced || "Outsourced not provided",
        six: item?.price || "Price not provided",
        delete: `/patientmaster/delete/${item?._id}`,
        action: "actions", // Placeholder for action buttons
        // Additional fields can be added here
      };
    });

  useEffect(() => {
    console.log("This is bottomSection", bottomSection);
    if (!bottomSection || bottomSection.length < 0) return;
    if (bottomSection.length === 0) return;
    console.log("p020", AddTestTable);
    if (AddTestTable?.length === 0) {
      setAddTestTable([bottomSection]);
      return;
    }
    console.log("This is AddTestTable", bottomSection);
    if (AddTestTable.map((item) => item._id).includes(bottomSection._id)) {
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
          <ScrollArea className="min-h-[13rem] w-full rounded-md  ">
            <Dashboard
              tableColumns={config?.tableColumns}
              setAddTestTable={setAddTestTable}
              AddTestTable={AddTestTable}
              tableData={mappedTableData}
              setcalculatedprice={setcalculatedprice}
            />
          </ScrollArea>
          {/* Discount  */}

          <Card className="bg-accent/10  mt-2">
            <CardHeader>{/* <CardTitle>Discount</CardTitle> */}</CardHeader>
            <CardContent>
              <Table className="table-auto w-full border-collapse border border-gray-200">
                {/* <TableHeader>
                  <TableRow>
                    <TableHead className="text-right px-4 py-2 border border-gray-200">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader> */}
                <TableBody>
                  <TableRow>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]">
                      Discount
                    </TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]">
                      <div className="grid gap-3">
                        <Select
                          placeholder="Select Discount"
                          value={discountarray}
                          onValueChange={(value) => {
                            const discount = discounts.filter(
                              (item) => item.value === value
                            );
                            setdiscountarray(discount.description);

                            setDiscountType(value);
                          }}
                        >
                          <SelectTrigger
                            id="paymentMode"
                            aria-label="Select payment mode"
                          >
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {discounts.map((discount) => (
                              <SelectItem value={discount.value}>
                                {discount.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Textarea></Textarea>
                      </div>
                    </TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 w-[10rem]"></TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 max-w-[10rem]">
                      <Input
                        type="number"
                        className="max-w-sm"
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                    <TableCell className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]">
                      <strong>SubTotal</strong>
                    </TableCell>
                    <TableCell
                      colSpan={1}
                      className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]"
                    >
                      <strong>{subtotalPrice}</strong>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
          {/* Visiting charges  */}
          <Card className="bg-accent/10  mt-2">
            <CardHeader>
              {/* <CardTitle>visiting charge</CardTitle> */}
            </CardHeader>
            <CardContent>
              <Table className="table-auto w-full border-collapse border border-gray-200">
                {/* <TableHeader>
                  <TableRow>
                    <TableHead className="text-right px-4 py-2 border border-gray-200">
                      Subtotal
                    </TableHead>
                  </TableRow>
                </TableHeader> */}
                <TableBody>
                  <TableRow>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]">
                      Home visit charges
                    </TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]">
                      <div className="grid gap-3">
                        <Select
                          value={homevisitcharge}
                          onValueChange={(value) => sethomevisitcharge(value)}
                        >
                          <SelectTrigger
                            id="paymentMode"
                            aria-label="Select payment mode"
                          >
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {associates.map((associate) => (
                              <SelectItem value={associate.firstName}>
                                {associate.firstName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 w-[10rem]"></TableCell>
                    <TableCell className="text-right px-4 py-2 border border-gray-200 w-[10rem]">
                      <Label>Visiting Charges</Label>
                    </TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 max-w-[10rem]">
                      <Input
                        type="number"
                        className="max-w-sm"
                        value={homevisit}
                        onChange={(e) => setHomevisit(e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                    <TableCell
                      colSpan={2}
                      className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]"
                    >
                      <strong>Grand Total</strong>
                    </TableCell>
                    <TableCell
                      colSpan={1}
                      className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]"
                    >
                      <strong>{homevisitPricetotal}</strong>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
          {/* Visiting charges  */}

          <Card className="bg-accent/10  mt-2">
            <CardHeader>{/* <CardTitle>Discount</CardTitle> */}</CardHeader>
            <CardContent>
              <Table className="table-auto w-full border-collapse border border-gray-200">
                <TableBody>
                  <TableRow>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]">
                      Payment Mode
                    </TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]">
                      <div className="flex  gap-2">
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
                        <Input type="number" className="max-w-sm" />
                      </div>
                    </TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 w-[10rem]"></TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 max-w-[10rem]">
                      <Input
                        type="number"
                        className="max-w-sm"
                        value={paymentmodeprice}
                        onChange={(e) => setpaymentmodeprice(e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                    <TableCell className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                    <TableCell
                      colSpan={1}
                      className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]"
                    >
                      <strong>
                        {homevisitPricetotal - paymentmodeprice < 0
                          ? 0
                          : homevisitPricetotal - paymentmodeprice}
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Patient delivery charges  */}

          <Card className="bg-accent/10  mt-2">
            <CardHeader>{/* <CardTitle>Discount</CardTitle> */}</CardHeader>
            <CardContent>
              <Table className="table-auto w-full border-collapse border border-gray-200">
                <TableBody>
                  <TableRow>
                    <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]">
                      Payment Delivery Mode
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"
                    >
                      <div className="flex  gap-2">
                        <MultiSelect
                          options={frameworksList}
                          onValueChange={(values) => {
                            setSelectedFrameworks(values);
                          }}
                          placeholder="Select Days"
                          variant="inverted"
                          maxCount={7}
                        />
                      </div>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      className="text-left px-4 py-2 border border-gray-200 w-[10rem]"
                    ></TableCell>
                    <TableCell
                      colSpan={2}
                      className="text-left px-4 py-2 border border-gray-200 max-w-[10rem]"
                    ></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Register</Button>
            </CardFooter>
          </Card>
          {/* Payment Mode */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Order;

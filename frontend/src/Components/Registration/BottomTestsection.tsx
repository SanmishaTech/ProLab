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
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceTemplate from "./InvoiceTemplate";
import PaymentDetailsTemplate from "./PaymentDetailsTemplate";
import type { BlobProvider } from "@react-pdf/renderer";

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

interface Test {
  _id: string;
  name: string;
  tat: string;
  urgentTime: string;
  outsourced: boolean;
  price: number;
  abbrivation?: string;
}

interface Discount {
  _id: string;
  value: string;
  description: string;
}

interface Associate {
  _id: string;
  firstName: string;
}

interface OrderProps {
  setOrderComp: (comp: any) => void;
  topComp: {
    patientId: string;
    referralId: string;
    referral?: {
      primaryRefferedBy: string;
      secondaryRefferedBy: string;
      billedTo: string;
      corporateCustomer: string;
      clinicHistory: string;
      medicationHistory: string;
    };
  };
}

const Order: React.FC<OrderProps> = ({ setOrderComp, topComp }) => {
  console.log("This is topComp", topComp);
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [paymentMode, setPaymentMode] = useState<string>("Cash");
  const [upiNumber, setUpiNumber] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<string>("");
  const user = localStorage.getItem("user");
  const User = user ? JSON.parse(user) : null;
  const [bottomSection, setBottomSection] = useState<Test | null>(null);
  const [filteredData, setFilteredData] = useState<Test[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<Test[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [AddTestTable, setAddTestTable] = useState<Test[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [discountarray, setdiscountarray] = useState<string>("");
  const [discountType, setDiscountType] = useState<string>("");
  const [calculatedprice, setCalculatedprice] = useState<number>(0);
  const [subtotalPrice, setSubtotalPrice] = useState<number>(0);
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [homevisit, setHomevisit] = useState<number>(0);
  const [homevisitPricetotal, setHomevisitPricetotal] = useState<number>(0);
  const [homevisitcharge, sethomevisitcharge] = useState<string>("");
  const [paymentmodeprice, setPaymentmodeprice] = useState<number>(0);
  const [paymentDeliverymode, setPaymentDeliverymode] = useState<string[]>([]);
  const [calculatedtats, setCalculatedtat] = useState<string>();

  useEffect(() => {
    console.log("This is AddTestTable", AddTestTable);
  }, [AddTestTable]);

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

  function formatCurrency(value) {
    if (typeof value === "number" || typeof value === "string") {
      return `₹${value}`;
    }
    throw new Error("Invalid value. Please provide a number or a string.");
  }

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

  // Function to calculate completion time for a test
  const calculateTestCompletionTime = async (test, isUrgent) => {
    try {
      // Get working hours
      const workingHoursResponse = await axios.get(
        `/api/workinghours/${User?._id}`
      );
      const workingHours = workingHoursResponse.data;

      // Get holidays
      const holidaysResponse = await axios.get("/api/holiday");
      const holidays = holidaysResponse.data;

      // Calculate completion time
      const response = await axios.post(
        "/api/registration/calculate-completion",
        {
          startTime: new Date(),
          duration: isUrgent ? test.urgentTime : test.tat,
          workingHours,
          holidays,
        }
      );

      return response.data.completionDate;
    } catch (error) {
      console.error("Error calculating completion time:", error);
      return null;
    }
  };

  // Function to handle test selection
  const handleTestSelect = async (test) => {
    const isUrgent = false; // You can add UI to toggle this
    const completionTime = await calculateTestCompletionTime(test, isUrgent);

    setItems((prev) => [
      ...prev,
      {
        ...test,
        urgent: isUrgent,
        startTime: new Date(),
        expectedCompletionTime: completionTime,
      },
    ]);
  };

  // Function to toggle urgent status
  const toggleUrgent = async (index) => {
    const test = items[index];
    const newUrgent = !test.urgent;
    const completionTime = await calculateTestCompletionTime(test, newUrgent);

    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...test,
        urgent: newUrgent,
        expectedCompletionTime: completionTime,
      };
      return updated;
    });
  };

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const pricePerUnit = item.urgent ? item.urgentPrice : item.price;
      const itemTotal = Number(pricePerUnit) * Number(item.quantity);
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error("Please add at least one test to the order.");
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

    try {
      // Prepare tests with TAT information
      const testsWithTAT = items.map((item) => ({
        tests: item.id,
        tat: item.urgent ? item.urgentTime : item.tat,
        urgent: item.urgent,
        price: item.urgent ? item.urgentPrice : item.price,
        startTime: new Date(),
        expectedCompletionTime: item.expectedCompletionTime,
      }));

      const response = await axios.post("/api/registration", {
        patientId: topComp?.patientId,
        referral: topComp?.referralId,
        tests: testsWithTAT,
        totaltestprice: calculateSubtotal(),
        discount,
        priceAfterDiscount,
        homevisit,
        priceafterhomevisit,
        paymentMode: {
          paymentMode: paymentMode,
          paidAmount: numericPaidAmount,
        },
        totalBalance,
        paymentDeliveryMode,
        userId: User?._id,
        registrationTime: new Date(),
      });

      console.log(response.data);
      toast.success("Registration created successfully!");
      navigate("/registrationlist");
    } catch (error) {
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
          { label: "Urgent", key: "checkbox" },
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

  useEffect(() => {
    console.log("This is AddTestTable", AddTestTable);
  }, [AddTestTable]);

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData = AddTestTable?.map((item: Test) => ({
    _id: item._id,

    one: item.abbrivation || "",
    two: item.name,
    three: (() => {
      // const now = new Date();
      // const expectedTime = new Date(item.calculatedTat);
      // console.log("expectmt , ", item.calculatedTat);
      // // Calculate TAT in milliseconds
      // const tatMs = expectedTime - now;

      // // Convert TAT to hours and minutes
      // const tatHours = Math.floor(tatMs / (1000 * 60 * 60));
      // const tatMinutes = Math.floor((tatMs % (1000 * 60 * 60)) / (1000 * 60));

      // return `${tatHours}:${tatMinutes}`;
      console.log("This is calculatedTat", item?.calculatedTat);
      const calculatedTat = new Date(item?.calculatedTat);

      // Check if the date is valid
      if (isNaN(calculatedTat)) {
        return "";
      }

      const now = new Date();
      const isToday = calculatedTat.toDateString() === now.toDateString(); // Check if the date is today

      const optionsForDateTime = {
        weekday: "long", // Example: Monday
        year: "numeric", // Example: 2025
        month: "long", // Example: January
        day: "numeric", // Example: 8
        hour: "2-digit", // Example: 02
        minute: "2-digit", // Example: 32
      };

      const optionsForTime = {
        hour: "2-digit",
        minute: "2-digit",
      };

      const time = isToday
        ? calculatedTat.toLocaleTimeString(undefined, optionsForTime)
        : calculatedTat.toLocaleString(undefined, optionsForDateTime);

      // Display only time for today, otherwise display date and time
      return isToday
        ? calculatedTat.toLocaleTimeString(undefined, optionsForTime)
        : calculatedTat.toLocaleString(undefined, optionsForDateTime);
    })(),
    four: (() => {
      console.log("This is calculatedurgenttat", item?.calculatedurgenttat);
      const calculatedTat = new Date(item?.calculatedurgenttat);

      // Check if the date is valid
      if (isNaN(calculatedTat)) {
        return "";
      }

      const now = new Date();
      const isToday = calculatedTat.toDateString() === now.toDateString(); // Check if the date is today

      const optionsForDateTime = {
        weekday: "long", // Example: Monday
        year: "numeric", // Example: 2025
        month: "long", // Example: January
        day: "numeric", // Example: 8
        hour: "2-digit", // Example: 02
        minute: "2-digit", // Example: 32
      };

      const optionsForTime = {
        hour: "2-digit",
        minute: "2-digit",
      };

      const time = isToday
        ? calculatedTat.toLocaleTimeString(undefined, optionsForTime)
        : calculatedTat.toLocaleString(undefined, optionsForDateTime);

      // Display only time for today, otherwise display date and time
      return isToday
        ? calculatedTat.toLocaleTimeString(undefined, optionsForTime)
        : calculatedTat.toLocaleString(undefined, optionsForDateTime);
    })(),
    five: item.outsourced,
    six: item.price,
    delete: `/patientmaster/delete/${item._id}`,
    action: "actions",
  }));

  useEffect(() => {
    if (!bottomSection) return;
    if (AddTestTable.length === 0) {
      setAddTestTable([bottomSection]);
      console.log("This is value for addtesttable", bottomSection);
      return;
    }
    if (AddTestTable.some((item) => item._id === bottomSection._id)) {
      return;
    }
    setAddTestTable([...AddTestTable, bottomSection]);
  }, [bottomSection]);

  const onRegisterClick = async () => {
    if (!topComp?.patientId) {
      toast.error("Please add at least one Patient or Referral to the order.");
      return;
    }
    if (AddTestTable.length === 0) {
      toast.error("Please add at least one Test to the order.");
      return;
    }

    try {
      console.log("This is AddTestTable", AddTestTable);
      const data = {
        patientId: topComp.patientId,
        referral: {
          primaryRefferal: topComp.referral?.primaryRefferedBy,
          secondaryRefferal: topComp.referral?.secondaryRefferedBy,
          billedTo: topComp.referral?.billedTo,
          coporateCustomer: topComp.referral?.corporateCustomer,
          clinicHistory: topComp.referral?.clinicHistory,
          medicationHistory: topComp.referral?.medicationHistory,
        },
        tests: AddTestTable.map((items) => ({
          tests: items.selectTest,
          tat: items.tat,
          urgentTime: items.urgentTime,
          outsourced: items.outsourced,
          price: items.price,
          expectedCompletionTime: items.calculatedTat,
        })),
        totaltestprice: calculatedprice,
        discount: {
          discountapplied: discounts?.find(
            (item) => item.value === discountType
          )?._id,
          dicountReason: "",
          discountValue: discountType,
        },
        priceAfterDiscount: subtotalPrice,
        homevisit: {
          homevisitAssignedto: associates?.find(
            (item) => item.firstName === homevisitcharge
          )?._id,
          visitCharges: Number(homevisit) || 0,
        },
        priceafterhomevisit: Number(homevisitPricetotal) || 0,
        paymentMode: {
          paymentMode: paymentMode,
          paidAmount: Number(paymentmodeprice) || 0,
        },
        totalBalance:
          Number(homevisitPricetotal) - Number(paymentmodeprice) || 0,
        paymentDeliveryMode: {
          paymentDeliveryMode: selectedFrameworks,
        },
        // maxCompletionTime: new Date(calculatedtat),
        userId: User?._id,
        staffName: User?.username,
        paymentDate: new Date().toISOString(),
      };

      // Save registration
      const response = await axios.post("/api/registration", data);
      console.log("Registration response:", response.data);

      // Prepare data for invoice PDF
      const invoiceData = {
        invoiceNumber: `INV-${new Date().getFullYear()}-${response.data._id}`,
        patient: {
          name: response.data.patientId?.firstName || "",
          age: response.data.patientId?.age || "",
          gender: response.data.patientId?.gender || "",
          phone: response.data.patientId?.mobile || "",
        },
        referral: response.data.referral?.primaryRefferal?.firstName || "",
        paymentMode: paymentMode,
        staffName: User?.username || "",
        services: AddTestTable.map((test) => ({
          name: test.name,
          tat: test.tat || "Standard",
          urgent: Boolean(test.urgentTime),
          price: Number(test.price) || 0,
          total: Number(test.price) || 0,
        })),
        subtotal: calculatedprice,
        discount: calculatedprice - subtotalPrice,
        discountName:
          discounts?.find((item) => item.value === discountType)?.description ||
          "No Discount",
        afterDiscount: subtotalPrice,

        homeVisitCharges: Number(homevisit) || 0,
        totalAmount: Number(homevisitPricetotal) || 0,
        amountPaid: Number(paymentmodeprice) || 0,
        balanceDue: Number(homevisitPricetotal) - Number(paymentmodeprice) || 0,
      };
      console.log("Invoice Data", invoiceData);

      // Generate and download PDFs
      const invoicePdf = (
        <PDFDownloadLink
          document={<InvoiceTemplate data={invoiceData} />}
          fileName={`invoice-${response.data._id}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              {loading ? "Generating Invoice..." : "Download Invoice"}
            </Button>
          )}
        </PDFDownloadLink>
      );

      const paymentDetailsPdf = (
        <PDFDownloadLink
          document={<PaymentDetailsTemplate data={invoiceData} />}
          fileName={`payment-details-${invoiceData.invoiceNumber}.pdf`}
        >
          {({ loading }: { loading: boolean }) => (
            <Button
              variant="link"
              disabled={loading}
              className="text-blue-600 hover:text-blue-800"
            >
              {loading ? "Preparing Details..." : "💰 Download Payment Details"}
            </Button>
          )}
        </PDFDownloadLink>
      );

      // Show success message with PDF download links
      toast.success(
        <div className="flex flex-col gap-2">
          <div className="font-semibold">Registration successful!</div>
          <div className="text-sm text-gray-600">
            Invoice #: {invoiceData.invoiceNumber}
          </div>
          <div className="flex flex-col gap-1">
            {invoicePdf}
            {paymentDetailsPdf}
          </div>
        </div>
      );

      navigate("/registrationlist");
    } catch (error: any) {
      console.error("Error in registration:", error);
      toast.error(
        error.response?.data?.error || "Failed to submit registration."
      );
    }
  };

  return (
    <div className="flex w-full h-full px-0 mt-4 bg-background items-center scroll-y-auto gap-5 ">
      {/* Available Services Card */}
      <Card className="w-full h-full bg-accent/30 shadow-lg max-w-6xl">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Test Details</CardTitle>
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
              setcalculatedprice={setCalculatedprice}
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
                          onValueChange={setPaymentMode}
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {paymentMode || "Select payment mode"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="cc/dc">CC/DC Cards</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
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
                        onChange={(e) => setPaymentmodeprice(e.target.value)}
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
              <Button onClick={() => onRegisterClick()}>Register</Button>
            </CardFooter>
          </Card>
          {/* Payment Mode */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Order;

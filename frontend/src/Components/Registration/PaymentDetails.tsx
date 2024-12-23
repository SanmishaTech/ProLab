import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PaymentHistory {
  _id: string;
  paymentMode: string;
  paidAmount: number;
  paymentDate: string;
  staffName: string;
  paymentDetails?: string;
}

interface Registration {
  _id: string;
  patient: {
    name: string;
    phone: string;
  };
  totaltestprice: number;
  priceAfterDiscount: number;
  priceafterhomevisit: number;
  totalBalance: number;
  paymentHistory: PaymentHistory[];
}

const PaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user");
  const User = user ? JSON.parse(user) : null;

  // New payment form state
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [upiNumber, setUpiNumber] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    fetchRegistrationDetails();
  }, [id]);

  const fetchRegistrationDetails = async () => {
    try {
      const response = await axios.get(`/api/registration/${id}`);
      setRegistration(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching registration:", error);
      toast.error("Failed to fetch registration details");
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!paidAmount) {
      toast.error("Please enter the payment amount");
      return;
    }

    try {
      const paymentData = {
        registrationId: id,
        paymentMode,
        paidAmount: Number(paidAmount),
        paymentDate: new Date().toISOString(),
        staffName: User?.username,
        paymentDetails,
        upiNumber: paymentMode === 'UPI' ? upiNumber : undefined,
        referenceNumber: paymentMode === 'Card' ? referenceNumber : undefined
      };

      await axios.post('/api/registration/payment', paymentData);
      toast.success("Payment added successfully");
      fetchRegistrationDetails(); // Refresh the data
      
      // Reset form
      setPaidAmount("");
      setPaymentDetails("");
      setUpiNumber("");
      setReferenceNumber("");
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!registration) {
    return <div>Registration not found</div>;
  }

  const totalPaid = registration.paymentHistory.reduce(
    (sum, payment) => sum + payment.paidAmount,
    0
  );

  const remainingBalance = registration.priceafterhomevisit - totalPaid;

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Registration ID: {registration._id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Patient Information</h3>
              <p>Name: {registration.patient.name}</p>
              <p>Phone: {registration.patient.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Amount Information</h3>
              <p>Total Amount: ₹{registration.priceafterhomevisit.toFixed(2)}</p>
              <p>Total Paid: ₹{totalPaid.toFixed(2)}</p>
              <p className="font-semibold text-blue-600">
                Balance: ₹{remainingBalance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Payment History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registration.paymentHistory.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.paymentMode}</TableCell>
                    <TableCell>₹{payment.paidAmount.toFixed(2)}</TableCell>
                    <TableCell>{payment.staffName}</TableCell>
                    <TableCell>{payment.paymentDetails || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Payment */}
          <div>
            <h3 className="font-semibold mb-4">Add Payment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select
                  value={paymentMode}
                  onValueChange={setPaymentMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              {paymentMode === 'UPI' && (
                <div className="space-y-2">
                  <Label>UPI Number</Label>
                  <Input
                    value={upiNumber}
                    onChange={(e) => setUpiNumber(e.target.value)}
                    placeholder="Enter UPI number"
                  />
                </div>
              )}

              {paymentMode === 'Card' && (
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter reference number"
                  />
                </div>
              )}

              <div className="space-y-2 col-span-2">
                <Label>Additional Details</Label>
                <Input
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  placeholder="Enter any additional payment details"
                />
              </div>
            </div>

            <Button
              className="mt-4"
              onClick={handleAddPayment}
              disabled={!paidAmount || loading}
            >
              Add Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetails; 
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import axios from "axios";
import { useParams } from "react-router-dom";

const Innersamplecollection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const { id } = useParams<{ id: string }>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [workingHours, setWorkingHours] = useState([
    {
      dateTime: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        millisecond: new Date().getMilliseconds(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        era: new Date().getFullYear() > 0 ? "AD" : "BC",
      },
      nonWorkingDay: false,
    },
  ]);

  const handleInputChange = (index, field, value) => {
    setWorkingHours((prev) => {
      const updated = [...prev];

      // Ensure the object exists at the specified index
      if (!updated[index]) {
        console.error(`No entry found at index ${index}`);
        return prev;
      }

      if (field === "breakFrom" || field === "breakTo") {
        // Format the value as 'YYYY-MM-DD HH:mm:ss'
        const dateTime = new Date(value); // Ensure 'value' is a valid date string or object
        const formattedDateTime = dateTime
          .toISOString()
          .replace("T", " ")
          .split(".")[0];
        updated[index][field] = formattedDateTime;
      } else if (field === "dateTime") {
        updated[index][field] = {
          ...updated[index][field], // Preserve existing properties
          ...value, // Overwrite with new values
        };
      } else {
        updated[index][field] = value;
      }

      console.log("Updated workingHours:", updated);
      return updated;
    });
  };

  useEffect(() => {
    //fetching sampledata
    const fetchingSampleData = async () => {
      try {
        const response = await axios.get(`/api/registration/reference/${id}`);

        if (response?.data) {
          const price = Array.isArray(response.data)
            ? response.data.reduce((sum, item) => {
                return (
                  sum +
                  (item?.tests?.reduce(
                    (testSum, test) => testSum + (test?.price || 0),
                    0
                  ) || 0)
                );
              }, 0)
            : response.data?.tests?.reduce(
                (sum, test) => sum + (test?.price || 0),
                0
              ) || 0;

          setTotalPrice(price);
        }

        const invoices = Array.isArray(response?.data)
          ? response.data.flatMap((item) =>
              item?.tests?.map((test) => ({
                invoice: item?._id,
                department: test?.tests?.department?.name || "N/A",
                sid: item?.sid || "N/A",
                patientName: item?.patientId?.firstName || "N/A",
                test: test?.tests?.name || "N/A",
                deliveryTime: test?.tat?.urgentTime || "N/A",
                collectionCenter:
                  item?.collectionCenter?.[0]?.collectionCenterName || "N/A",
                collectionTime:
                  item?.collectionCenter?.[0]?.collectionTime || "N/A",
                barcode: test?.barcode || "N/A",
                rejectionReason: test?.rejectionReason || "N/A",
                price: test?.price || 0,
              }))
            )
          : Object.keys(response?.data || {}).length
          ? response?.data?.tests?.map((test) => ({
              invoice: response.data?._id,
              department: test?.tests?.department?.name || "N/A",
              sid: response.data?.sid || "N/A",
              patientName: response.data?.patientId?.firstName || "N/A",
              test: test?.tests?.name || "N/A",
              deliveryTime: test?.tat?.urgentTime || "N/A",
              collectionCenter:
                response.data?.collectionCenter?.[0]?.collectionCenterName ||
                "N/A",
              collectionTime:
                response.data?.collectionCenter?.[0]?.collectionTime || "N/A",
              barcode: test?.barcode || "N/A",
              rejectionReason: test?.rejectionReason || "N/A",
              price: test?.price || 0,
            }))
          : [];
        console.log("Invoices:", invoices);

        setData(invoices);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchingSampleData();
  }, [id]);

  function capitalizeText(text) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <Card className="m-4 mt-20">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">checkbox</TableHead>
              <TableHead className="w-[100px]">Department</TableHead>
              <TableHead>Sid</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Delivery Time</TableHead>
              <TableHead>Collection Center</TableHead>
              <TableHead>Collection Time</TableHead>
              <TableHead className="w-[100px]">Collect</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Rejection Reason</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice, index) => (
              <TableRow key={`${invoice.invoice}_${index}`}>
                <TableCell className="font-medium">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">
                  {capitalizeText(invoice?.department)}
                </TableCell>
                <TableCell>{capitalizeText(invoice?.sid)}</TableCell>
                <TableCell>{capitalizeText(invoice?.patientName)}</TableCell>
                <TableCell className="max-w-[200px]">
                  {capitalizeText(invoice?.test)}
                </TableCell>
                <TableCell>{capitalizeText(invoice?.deliveryTime)}</TableCell>
                <TableCell>
                  {capitalizeText(invoice?.collectionCenter)}
                </TableCell>
                <TableCell>
                  <div className="w-full max-w-xl flex flex-row gap-4">
                    <DatePicker
                      hideTimeZone
                      showMonthAndYearPickers
                      defaultValue={now(getLocalTimeZone())}
                      label="Event Date"
                      variant="bordered"
                      onChange={(value) => {
                        console.log("Date changed:", value);
                        handleInputChange(index, invoice.test, value);
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Button>Accept</Button>
                </TableCell>
                <TableCell>{capitalizeText(invoice?.barcode)}</TableCell>
                <TableCell>{invoice?.rejectionReason}</TableCell>
                <TableCell className="text-right">{invoice?.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={11} className="text-right ">
                Total
              </TableCell>
              <TableCell className="text-right">${totalPrice}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Innersamplecollection;

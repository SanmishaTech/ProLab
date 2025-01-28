import React, { useCallback, useEffect, useState, useMemo } from "react";
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

interface TestItem {
  tests?: {
    _id: string;
    department?: {
      name: string;
    };
    name: string;
  };
  tat?: {
    urgentTime: string;
  };
  price: number;
  barcode?: string;
  rejectionReason?: string;
}

interface RegistrationData {
  tests?: TestItem[];
  patientId?: {
    firstName: string;
  };
  sid?: string;
  collectionCenter?: Array<{
    collectionCenterName: string;
    collectionTime: string;
  }>;
}

interface SampleData {
  patientName: string;
  test: string;
  department: string;
  sid: string;
  invoice: string;
  deliveryTime: string;
  collectionCenter: string;
  collectionTime: string;
  barcode: string;
  rejectionReason: string;
  price: number;
  dateTime?: string;
}

interface WorkingHour {
  dateTime: {
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    timeZone: string;
    era: string;
  };
  nonWorkingDay: boolean;
  [key: string]: any;
}

const alltests = new Map<string, TestItem>();

const Innersamplecollection = () => {
  const [data, setData] = useState<SampleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [filteredData, setFilteredData] = useState<SampleData[]>([]);
  const user = localStorage.getItem("user");
  const User = user ? JSON.parse(user) : null;
  const [sampledata, setSampledata] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([
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

  useEffect(() => {
    console.log("New sampledta", sampledata);
  }, [sampledata]);

  const handlecollect = async (invoice: SampleData | SampleData[]) => {
    const invoiceArray = Array.isArray(invoice) ? invoice : [invoice];
    const datatosave = {
      Registration: id,
      Tests: invoiceArray.map((inv) => ({
        test: inv.invoice,
        status: "collected",
        collectedAt: inv.dateTime || new Date().toISOString(),
        collectedBy: User?._id,
      })),
      userId: User?._id,
    };

    try {
      await axios.post("/api/samplecollection", datatosave);
      // Re-fetch SampleCollection data to update UI
      const response = await axios.get(
        `/api/samplecollection/registration/${id}`
      );
      setSampledata(response.data);
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  // Helper function to process registration response
  const processRegistrationData = (
    data: RegistrationData | RegistrationData[]
  ) => {
    return Array.isArray(data)
      ? data.flatMap(
          (item: RegistrationData) =>
            item?.tests?.map((test: TestItem) => ({
              // ... same mapping logic as in useEffect
            })) || []
        )
      : data?.tests?.map((test: TestItem) => ({
          // ... same mapping logic as in useEffect
        })) || [];
  };

  useEffect(() => {
    const fetchSampleCollectionData = async () => {
      try {
        const response = await axios.get(
          `/api/samplecollection/registration/${id}`
        );
        setSampledata(response.data);
      } catch (error) {
        console.error("Error fetching sample collection data:", error);
      }
    };
    fetchSampleCollectionData();
  }, [id]); // Dependency on id ensures fetch when registration changes

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const response = await axios.get<RegistrationData | RegistrationData[]>(
          `/api/registration/reference/${id}`
        );

        // Process tests from registration response
        const invoices = Array.isArray(response.data)
          ? response.data.flatMap(
              (item: RegistrationData) =>
                item?.tests?.map((test: TestItem) => ({
                  invoice: test?.tests?._id || "",
                  patientId: item.patientId?._id || "",
                  department: test?.tests?.department?.name || "N/A",
                  sid: item?.sid || "N/A",
                  patientName: item.patientId?.firstName || "N/A",
                  test: test?.tests?.name || "N/A",
                  deliveryTime: test?.tat?.urgentTime?.toString() || "N/A",
                  collectionCenter:
                    item.collectionCenter?.[0]?.collectionCenterName || "N/A",
                  collectionTime:
                    item.collectionCenter?.[0]?.collectionTime || "N/A",
                  barcode: test?.barcode || "N/A",
                  rejectionReason: test?.rejectionReason || "N/A",
                  price: test?.price || 0,
                })) || []
            )
          : response.data?.tests?.map((test: TestItem) => ({
              _id: response.data?._id || "",
              invoice: test?.tests?._id || "",
              status: test?.status || "",
              patientId: response.data?.patientId?._id || "",
              department: test?.tests?.department?.name || "N/A",
              sid: response.data?.sid || "N/A",
              patientName: response.data?.patientId?.firstName || "N/A",
              test: test?.tests?.name || "N/A",
              deliveryTime: test?.tat?.urgentTime?.toString() || "N/A",
              collectionCenter:
                response.data?.collectionCenter?.[0]?.collectionCenterName ||
                "N/A",
              collectionTime:
                response.data?.collectionCenter?.[0]?.collectionTime || "N/A",
              barcode: test?.barcode || "N/A",
              rejectionReason: test?.rejectionReason || "N/A",
              price: test?.price || 0,
            })) || [];
        console.log("Invoices:", response.data.tests);
        setData(invoices);
        setFilteredData(invoices);
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchRegistrationData();
  }, [id]);

  useEffect(() => {
    const newTotal = filteredData.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
    setTotalPrice(newTotal);
  }, [filteredData]);

  function capitalizeText(text: string | undefined): string {
    if (!text) return "N/A"; // Return default value if text is undefined or null
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handlesubmit = () => {
    const selectedTestsWithData = selectedTests.map((invoice) => {
      const test = alltests.get(invoice);
      return {
        ...test,
        collectionDateTime:
          selectedTests.find((i) => i === invoice)?.dateTime || "",
      };
    });

    console.log("Selected tests with datetime:", selectedTestsWithData);
  };
  useEffect(() => {
    console.log("sometdata", data);
  }, [data]);

  // Add useEffect to handle filtering
  useEffect(() => {
    if (!data || !sampledata) return;

    const collectedTestIds = new Set();

    // Collect test IDs and statuses from sampledata
    sampledata.forEach((sample) => {
      sample.tests.forEach((test) => {
        if (test) {
          console.log("Test ID:", test.test);
          test.test.forEach((t) => {
            collectedTestIds.add(t._id); // Add individual test IDs
          });
        }
      });
    });

    console.log("Data variable:", data);
    console.log("Sample Id:", sampledata);

    // Filter out items whose invoice is in collectedTestIds and match statuses
    const filtered = data.filter((item) => {
      // Find the sample with a matching status
      const matchingSample = sampledata.find((sample) =>
        sample.tests.some((test) => {
          console.log(test.status !== "pending");
          return test.status === "pending";
        })
      );
      console.log("Paa", matchingSample);
      console.log("item", item);
      // Ensure the status matches if a matching sample is found
      return (
        !collectedTestIds.has(item.invoice) ||
        (matchingSample && matchingSample.status !== "pending")
      );
    });

    console.log("Filtered Data:", filtered);

    setFilteredData(filtered);
  }, [data, sampledata, filterValue]);

  return (
    <Card className="m-4 mt-20">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Checkbox
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const allTests = data.map((item) => ({
                        invoice: item.invoice,
                        dateTime: item.dateTime || new Date().toISOString(),
                      }));
                      setSelectedTests(allTests.map((item) => item.invoice));
                    } else {
                      setSelectedTests([]);
                    }
                  }}
                />
              </TableHead>
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
            {filteredData?.map((invoice, index) => (
              <TableRow key={`${invoice.invoice}_${index}`}>
                <TableCell className="font-medium">
                  <Checkbox
                    checked={selectedTests.some(
                      (item) => item === invoice.invoice
                    )}
                    onCheckedChange={(checked) => {
                      setSelectedTests((prev) => {
                        if (checked) {
                          return [...prev, invoice.invoice];
                        } else {
                          return prev.filter((i) => i !== invoice.invoice);
                        }
                      });
                    }}
                  />
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
                      label="Collection Time"
                      defaultValue={now(getLocalTimeZone())}
                      onChange={(value) => {
                        const isoDate = value
                          .toDate(getLocalTimeZone())
                          .toISOString();
                        setData((prev) =>
                          prev.map((item) =>
                            item.invoice === invoice.invoice
                              ? { ...item, dateTime: isoDate }
                              : item
                          )
                        );
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Button onClick={() => handlecollect(invoice)}>
                    Collect
                  </Button>
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
      <CardFooter className="flex justify-end">
        <Button
          onClick={handlesubmit}
          className=" text-white px-4 py-2 rounded flex justify-end"
        >
          Collect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Innersamplecollection;

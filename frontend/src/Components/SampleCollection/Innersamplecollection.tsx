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

  const handlecollect = (invoice: SampleData | SampleData[]) => {
    // Ensure invoice is an array
    const invoiceArray = Array.isArray(invoice) ? invoice : [invoice];

    const datatosave = {
      Registration: id,
      Tests: invoiceArray.map((inv) => ({
        Tests: inv.invoice,
        dateTime: inv.dateTime || new Date().toISOString(),
      })),
      userId: User?._id,
    };

    const saveSelectedTests = async () => {
      try {
        const response = await axios
          .post("/api/samplecollection", datatosave)
          .then((response) => {
            setSampledata(response.data.updatedRecord);
          })
          .then(() => {
            window.location.reload();
          });
      } catch (error) {
        console.error("Error saving selected tests:", error);
      }
    };
    saveSelectedTests();
  };

  useEffect(() => {
    const fetchingSampleData = async () => {
      try {
        const response = await axios
          .get(`/api/samplecollection/allsamplemaster/${User?._id}/${id}`)
          .then((response) => setSampledata(response.data));
        console.log("response", response?.data);
      } catch (error) {
        console.error("Error fetching sample data:", error);
      }
    };
    fetchingSampleData();
  }, []);

  const handleInputChange = (index: number, field: string, value: any) => {
    setWorkingHours((prev) => {
      const updated = [...prev];

      if (!updated[index]) {
        console.error(`No entry found at index ${index}`);
        return prev;
      }

      if (field === "breakFrom" || field === "breakTo") {
        const dateTime = new Date(value);
        const formattedDateTime = dateTime
          .toISOString()
          .replace("T", " ")
          .split(".")[0];
        updated[index][field] = formattedDateTime;
      } else if (field === "dateTime") {
        updated[index].dateTime = {
          ...updated[index].dateTime,
          ...value,
        };
      } else {
        updated[index][field] = value;
      }

      const dateObj = updated[index].dateTime;
      const formattedDate = new Date(
        dateObj.year,
        dateObj.month - 1,
        dateObj.day,
        dateObj.hour,
        dateObj.minute
      );

      const isoString = formattedDate.toISOString();
      const humanReadable =
        `${String(dateObj.day).padStart(2, "0")}/${String(
          dateObj.month
        ).padStart(2, "0")}/${dateObj.year} ` +
        `${String(dateObj.hour).padStart(2, "0")}:${String(dateObj.minute)}`;

      setData((prev) => {
        const updatedData = [...prev];
        if (updatedData[index]) {
          updatedData[index].dateTime = humanReadable;
        }
        return updatedData;
      });

      return updated;
    });
  };

  useEffect(() => {
    const fetchingSampleData = async () => {
      try {
        const response = await axios.get<RegistrationData | RegistrationData[]>(
          `/api/registration/reference/${id}`
        );

        if (response?.data) {
          const price = Array.isArray(response.data)
            ? response.data.reduce((sum: number, item: RegistrationData) => {
                return (
                  sum +
                  (item?.tests?.reduce(
                    (testSum: number, test: TestItem) =>
                      testSum + (test?.price || 0),
                    0
                  ) || 0)
                );
              }, 0)
            : response.data?.tests?.reduce(
                (sum: number, test: TestItem) => sum + (test?.price || 0),
                0
              ) || 0;

          setTotalPrice(price);
        }
        console.log("This is response", response.data);
        const invoices = Array.isArray(response?.data)
          ? response.data.flatMap(
              (item: RegistrationData) =>
                item?.tests?.map((test: TestItem) => ({
                  invoice: test?.tests?._id || "",
                  patientId: response.data?.patientId?._id || "",
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
                })) || []
            )
          : response.data?.tests?.map((test: TestItem) => ({
              invoice: test?.tests?._id || "",
              patientId: response.data?.patientId?._id || "",
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
            })) || [];

        setData(invoices);
        setFilteredData(invoices);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchingSampleData();
  }, [id]);

  function capitalizeText(text: string) {
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

    console.log("This is data", data);
    console.log("This is sample data", sampledata);

    // Extract the test IDs present in sampleData
    const testIdsInSampleData = new Set(
      sampledata.map((sample) => sample?.tests?.test?._id)
    );
    const patientIdsInSampleData = new Set(
      sampledata.map((sample) => sample?.patientId)
    );
    console.log("This is testIdsInSampleData", patientIdsInSampleData);

    // Filter the data based on the condition
    const filtered = data.filter(
      (item) =>
        !testIdsInSampleData.has(item.invoice) &&
        !patientIdsInSampleData.has(item.patientId)
    );

    console.log("Filtered data", filtered);

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
                      hideTimeZone
                      showMonthAndYearPickers
                      defaultValue={now(getLocalTimeZone())}
                      label="Event Date"
                      variant="bordered"
                      onChange={(value) => {
                        console.log(value);

                        try {
                          const {
                            year,
                            month,
                            day,
                            hour,
                            minute,
                            second,
                            millisecond,
                            offset,
                          } = value;

                          // Create a date with the provided details (local time)
                          const localDate = new Date(
                            year,
                            month - 1,
                            day,
                            hour,
                            minute,
                            second,
                            millisecond
                          );

                          // Adjust for the timezone offset (convert to UTC)
                          const utcDate = new Date(
                            localDate.getTime() - offset
                          );

                          // Convert to ISO 8601 format
                          const isoDateTime = utcDate.toISOString();

                          console.log(isoDateTime); // Log the ISO date string

                          // Update state
                          setSelectedTests((prev) =>
                            prev.map((item) => {
                              if (item === invoice.invoice) {
                                return isoDateTime;
                              }
                              return item;
                            })
                          );
                        } catch (error) {
                          console.error("Invalid date format:", value, error);
                        }
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

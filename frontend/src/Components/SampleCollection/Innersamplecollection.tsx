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

const alltests = new Map();

const Innersamplecollection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [sampledata, setSampledata] = useState([]);
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

  useEffect(() => {
    console.log("New sampledta", sampledata);
  }, [sampledata]);

  const handlecollect = (invoice) => {
    console.log("invoice passed to handlecollect:", invoice);

    // Ensure invoice is an array
    if (!Array.isArray(invoice)) {
      invoice = [invoice];
    }

    const datatosave = {
      Registration: id,
      Tests: invoice.map((inv) => ({
        Tests: inv.invoice,
        dateTime: inv.dateTime || new Date().toISOString(),
      })),
      userId: User?._id,
    };
    //update the data to remove the tests

    console.log("datatosave:", datatosave);

    const saveSelectedTests = async () => {
      try {
        const response = await axios
          .post("/api/samplecollection", datatosave)
          .then((response) => {
            setSampledata(response.data.updatedRecord);
            console.log(
              "response.data.updatedRecord:",
              response.data.updatedRecord
            );
          })
          .then((response) => {
            window.location.reload();
          });

        console.log("response:", response);
      } catch (error) {
        console.error("Error saving selected tests:", error);
      }
    };
    saveSelectedTests();

    console.log("selectedTests:", selectedTests);
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

      const dateObj = updated[index].dateTime;

      const formattedDate = new Date(
        dateObj.year,
        dateObj.month - 1, // JavaScript months are 0-based
        dateObj.day,
        dateObj.hour,
        dateObj.minute
      );

      // Format as ISO 8601
      const isoString = formattedDate.toISOString();

      // Format as Human-Readable
      const humanReadable =
        `${String(dateObj.day).padStart(2, "0")}/${String(
          dateObj.month
        ).padStart(2, "0")}/${dateObj.year} ` +
        `${String(dateObj.hour).padStart(2, "0")}:${String(dateObj.minute)}`;

      console.log("ISO 8601:", isoString);
      console.log("Human-Readable:", humanReadable);
      setData((prev) => {
        const updatedData = [...prev];
        console.log("Updated data:", updatedData[index]);
        updatedData[index].dateTime = humanReadable;
        return updatedData;
      });
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
                invoice: item?.tests?._id,
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
              invoice: test?.tests?._id,
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
        console.log("response.data?.test?.tests", response.data);
        response.data?.tests?.map((test) => {
          console.log("test", test);
          alltests.set(test?.tests._id, test?.tests);
          console.log("alltests", alltests);
        });

        console.log("alltests:", alltests);
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

  const handlesubmit = () => {
    const selectedTestsWithData = selectedTests.map(({ invoice, dateTime }) => {
      const test = alltests.get(invoice);
      return {
        ...test,
        collectionDateTime: dateTime,
      };
    });

    console.log("Selected tests with datetime:", selectedTestsWithData);
  };
  useEffect(() => {
    console.log("sometdata", data);
  }, [data]);

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
                      setSelectedTests(allTests);
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
                      (item) => item.invoice === invoice.invoice
                    )}
                    onCheckedChange={(checked) => {
                      setSelectedTests((prev) => {
                        if (checked) {
                          return [
                            ...prev,
                            {
                              invoice: invoice.invoice,
                              dateTime:
                                invoice.dateTime || new Date().toISOString(),
                            },
                          ];
                        } else {
                          return prev.filter(
                            (item) => item.invoice !== invoice.invoice
                          );
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
                              if (item.invoice === invoice.invoice) {
                                return { ...item, dateTime: isoDateTime };
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

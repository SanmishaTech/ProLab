import React, { useState, useEffect } from "react";
import axios from "axios";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const data = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Workinghours = () => {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [workingHours, setWorkingHours] = useState(
    data.map((day) => ({
      day: day.toLowerCase(),
      nonWorkingDay: false,
      workingHours: { from: new Time(9, 0), to: new Time(17, 0) },
      break: { from: new Time(13, 0), to: new Time(14, 0) },
    }))
  );

  const [nonwrokingdays, setNonwrokingdays] = useState([]);

  const addnonworkingday = (day) => {
    setNonwrokingdays(
      nonwrokingdays.includes(day) ? nonwrokingdays : [...nonwrokingdays, day]
    );
  };

  useEffect(() => {
    // Fetch working hours when component mounts
    const fetchWorkingHours = async () => {
      try {
        const response = await axios.get(`/api/workinghours/${User?._id}`);
        if (response.data?.schedule) {
          setWorkingHours(
            response.data.schedule.map((entry) => ({
              ...entry,
              workingHours: {
                from: new Time(
                  entry.workingHours.from.split(":")[0],
                  entry.workingHours.from.split(":")[1]
                ),
                to: new Time(
                  entry.workingHours.to.split(":")[0],
                  entry.workingHours.to.split(":")[1]
                ),
              },
              break: {
                from: new Time(
                  entry.break.from.split(":")[0],
                  entry.break.from.split(":")[1]
                ),
                to: new Time(
                  entry.break.to.split(":")[0],
                  entry.break.to.split(":")[1]
                ),
              },
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching working hours:", error);
        toast.error("Failed to load working hours");
      }
    };

    if (User?._id) {
      fetchWorkingHours();
    }
  }, [User?._id]);

  const handleInputChange = (index, field, subField, value) => {
    console.log(value);
    setWorkingHours((prev) => {
      const updated = [...prev];
      if (subField) {
        updated[index][field][subField] =
          value instanceof Time
            ? value
            : new Time(value.split(":")[0], value.split(":")[1]);
      } else {
        updated[index][field] = value;
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      // Prepare the state data for submission
      const payload = {
        userId: User?._id,
        schedule: workingHours.map((entry) => ({
          day: entry.day,
          nonWorkingDay: entry.nonWorkingDay,
          workingHours: {
            from: entry.workingHours.from.toString(),
            to: entry.workingHours.to.toString(),
          },
          break: {
            from: entry.break.from.toString(),
            to: entry.break.to.toString(),
          },
        })),
      };

      await axios.post("/api/workinghours", payload);
      toast.success("Working hours updated successfully");
    } catch (error) {
      console.error("Error saving working hours:", error);
      toast.error("Failed to save working hours");
    }
  };

  return (
    <Card className="m-4 mt-20">
      <CardHeader>
        <CardTitle>Working Hours</CardTitle>
        <CardDescription>Set your working hours for the week.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="table-auto w-full border-collapse border border-gray-200">
          <TableCaption>Manage your working hours and breaks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="border-b-2 border-r-2 text-center">
                Day
              </TableHead>
              <TableHead className="border-b-2 border-r-2 text-center max-w-[100px]">
                Non-Working Day
              </TableHead>
              <TableHead className="border-b-2 border-r-2 text-center">
                Time
                <div className="flex justify-evenly mt-1">
                  <label>From</label>
                  <label>To</label>
                </div>
              </TableHead>
              <TableHead className="border-b-2 border-r-2 text-center">
                Break
                <div className="flex justify-evenly mt-1">
                  <label>From</label>
                  <label>To</label>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workingHours.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="border-r-2 text-center">
                  {entry.day}
                </TableCell>
                <TableCell className="border-r-2 text-center">
                  <Checkbox
                    checked={entry.nonWorkingDay}
                    onCheckedChange={(e) => {
                      console.log(e);
                      handleInputChange(index, "nonWorkingDay", null, e);
                    }}
                  />
                </TableCell>

                <TableCell colSpan={1} className="border-r-2 text-center">
                  <div className="flex justify-evenly gap-4 text-left ">
                    <TimeInput
                      value={entry.workingHours.from}
                      label="Start Time"
                      onChange={(value) =>
                        handleInputChange(index, "workingHours", "from", value)
                      }
                    />
                    <TimeInput
                      value={entry.workingHours.to}
                      label="End Time"
                      onChange={(value) =>
                        handleInputChange(index, "workingHours", "to", value)
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-evenly gap-4 text-left ">
                    <TimeInput
                      isDisabled={entry.nonWorkingDay}
                      value={entry.break.from}
                      label="Start Time"
                      onChange={(value) =>
                        handleInputChange(index, "break", "from", value)
                      }
                    />
                    <TimeInput
                      isDisabled={entry.nonWorkingDay}
                      value={entry.break.to}
                      label="End Time"
                      onChange={(value) =>
                        handleInputChange(index, "break", "to", value)
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Working Hours
        </button>
      </CardFooter>
    </Card>
  );
};

export default Workinghours;

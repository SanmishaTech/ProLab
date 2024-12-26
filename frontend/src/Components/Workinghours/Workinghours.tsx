import React, { useState } from "react";
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
  const [workingHours, setWorkingHours] = useState(
    data.map((day) => ({
      day,
      nonWorkingDay: false,
      time: { from: new Time(9, 0), to: new Time(17, 0) },
      break: { from: new Time(12, 0), to: new Time(13, 0) },
    }))
  );

  const handleInputChange = (index, field, subField, value) => {
    setWorkingHours((prev) => {
      const updated = [...prev];
      if (subField) {
        updated[index][field][subField] = value;
      } else {
        updated[index][field] = value;
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    // Prepare the state data for submission
    const payload = workingHours.map((entry) => ({
      day: entry.day,
      nonWorkingDay: entry.nonWorkingDay,
      timeFrom: entry.time.from.toString(),
      timeTo: entry.time.to.toString(),
      breakFrom: entry.break.from.toString(),
      breakTo: entry.break.to.toString(),
    }));

    console.log("Payload to send to backend:", payload);
    // Here, you can replace the console.log with an actual API call, e.g.,
    // fetch('/api/working-hours', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
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
                    onChange={(e) => {
                      console.log(
                        "Checkbox toggled for",
                        entry.day,
                        ":",
                        e.target.checked
                      );
                      handleInputChange(
                        index,
                        "nonWorkingDay",
                        null,
                        e.target.checked
                      );
                    }}
                  />
                </TableCell>

                <TableCell colSpan={1} className="border-r-2 text-center">
                  <div className="flex justify-evenly gap-4 text-left ">
                    <TimeInput
                      value={entry.time.from}
                      label="Start Time"
                      onChange={(value) =>
                        handleInputChange(index, "time", "from", value)
                      }
                    />
                    <TimeInput
                      value={entry.time.to}
                      label="End Time"
                      onChange={(value) =>
                        handleInputChange(index, "time", "to", value)
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-evenly gap-4 text-left ">
                    <TimeInput
                      value={entry.break.from}
                      label="Start Time"
                      onChange={(value) =>
                        handleInputChange(index, "break", "from", value)
                      }
                    />
                    <TimeInput
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
          Submit
        </button>
      </CardFooter>
    </Card>
  );
};

export default Workinghours;

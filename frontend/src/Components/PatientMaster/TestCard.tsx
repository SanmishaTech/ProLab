import { Link, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/dateTimepicker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { Controller } from "react-hook-form";

const patientFormSchema = z.object({
  middleName: z.string().optional(),
  salutation: z.string().optional(),
  hfaId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  country: z
    .string()
    .min(2, {
      message: "Country must be at least 2 characters.",
    })
    .max(30, {
      message: "Country must not be longer than 30 characters.",
    }),
  state: z
    .string()
    .min(2, {
      message: "State must be at least 2 characters.",
    })
    .max(30, {
      message: "State must not be longer than 30 characters.",
    }),
  city: z
    .string()
    .min(2, {
      message: "City must be at least 2 characters.",
    })
    .max(30, {
      message: "City must not be longer than 30 characters.",
    }),
  address: z
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .max(30, {
      message: "Address must not be longer than 30 characters.",
    }),
  mobile: z
    .string()
    .min(2, {
      message: "Mobile must be at least 2 characters.",
    })
    .max(30, {
      message: "Mobile must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .max(30, {
      message: "Email must not be longer than 30 characters.",
    }),
  dateOfBirth: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  ageType: z.string().optional(),
  patientType: z.string().optional(),
  bloodGroup: z.string().optional(),
  maritalStatus: z.string().optional(),
  priorityCard: z.boolean().optional(),
  value: z.union([z.number(), z.string()]).optional(),
  percentage: z.union([z.number(), z.string()]).optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<PatientFormValues> = {
  country: "india",
  state: "maharashtra",
};

function ProfileForm() {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const salutation = form.watch("salutation");
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  //   const { fields, append } = useFieldArray({
  //     name: "urls",
  //     control: form.control,
  //   });
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showFields, setShowFields] = useState<Boolean>(false);
  const [gender, setGender] = useState<String | null>(null);

  const dateOfBirth = form.watch("dateOfBirth");

  const handleDateChange = (date: Date | null) => {
    // Update dateOfBirth field when date is selected
    form.setValue("dateOfBirth", date ? date.toISOString() : null);
  };

  async function onSubmit(data: PatientFormValues) {
    // console.log("Sas", data);
    console.log("ppappappa");
    data.userId = User?._id;
    // Implement actual profile update logic here
    await axios.post(`/api/patientmaster`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Patient details updated successfully");
      navigate("/patientmaster");
    });
  }

  // async function onSubmit(data: PatientFormValues) {
  //   // Create FormData to send the image and other form data
  //   const formData = new FormData();

  //   // Append form values to FormData
  //   for (const key in data) {
  //     if (data[key]) {
  //       formData.append(key, data[key]);
  //     }
  //   }

  //   // Append the image if available
  //   if (data.image) {
  //     formData.append("image", data.image);
  //   }

  //   try {
  //     const response = await axios.put(
  //       `/api/patientmaster/update/${id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data", // This is necessary for file uploads
  //         },
  //       }
  //     );
  //     toast.success("Patient updated successfully");
  //     navigate("/patientmaster");
  //   } catch (error) {
  //     toast.error("Error updating patient");
  //     console.error(error);
  //   }
  // }

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Set the preview URL
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };
  // const handleSalutationChange = (e) => {
  //   if (e === "Mr") {
  //     form.setValue("gender", "male");
  //   } else if (e === "Mrs") {
  //     form.setValue("gender", "Female");
  //   }
  // };

  const handleSalutationChange = (e: string) => {
    if (e === "mr") {
      form.setValue("gender", "male"); // Set gender to male if "Mr" is selected
    } else if (e === "mrs") {
      form.setValue("gender", "female"); // Set gender to female if "Mrs" is selected
    } else if (e === "ms") {
      form.setValue("gender", "female"); // Set gender to female if "Mrs" is selected
    } else {
      form.setValue("gender", ""); // Reset gender if salutation is something else
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pb-[2rem]"
      >
        {" "}
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {field.onChange(e.target.files?.[0]); handleImageChange(e)}}
                  />
                 
                </FormControl>
                <FormDescription>Upload a Logo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
        </div>
         */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="hfaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HFA ID</FormLabel>
                <FormControl>
                  <Input placeholder="HFA ID..." {...field} />
                </FormControl>
                <FormDescription>What is your ID?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="salutation"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>select Salutation</FormLabel>
                <Select
                  onValueChange={(e) => {
                    form.setValue("salutation", e);
                    handleSalutationChange(e);
                  }}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Salutation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="baby">Baby</SelectItem>
                    <SelectItem value="dr">Dr</SelectItem>
                    <SelectItem value="mr">Mr</SelectItem>
                    <SelectItem value="mrs">Mrs</SelectItem>
                    <SelectItem value="ms">Ms</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How should we address you?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name..." {...field} />
                </FormControl>
                <FormDescription>What is your first name?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Middle name..." {...field} />
                </FormControl>
                <FormDescription>What is your Middle name?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name..." {...field} />
                </FormControl>
                <FormDescription>What is your last name?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>select Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value || "india"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="china">China</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your country?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>select State</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value || "maharashtra"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a State" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="tamilnadu">Tamilnadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your State?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>select City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dombivli">Dombivli</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your City?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Address..." {...field} />
                </FormControl>
                <FormDescription>What is your name of Address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Mobile..." {...field} />
                </FormControl>
                <FormDescription>What is your name of Mobile.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email..." {...field} />
                </FormControl>
                <FormDescription>What is your name of Email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="f">
            <Label htmlFor="dateOfBirth" className="text-right">
              Date of Birth
            </Label>
            <DateTimePicker
              granularity="day"
              value={dateOfBirth ? new Date(dateOfBirth) : null}
              onChange={handleDateChange}
              displayFormat={{
                hour24: "MM/dd/yyyy", // Customize to your preferred format
                hour12: "MM/dd/yyyy", // Also customize for 12-hour format if relevant
              }}
            />

            <FormDescription className="mt-2">
              What is your Date of birth.
            </FormDescription>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input placeholder="Age..." {...field} />
                </FormControl>
                <FormDescription>What is your age.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  // defaultValue={field.value}
                  value={form.watch("gender")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your Gender?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="ageType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Age Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your age Type?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>select Blood group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A+ve">A+ve</SelectItem>
                    <SelectItem value="AB+ve">AB+ve</SelectItem>
                    <SelectItem value="AB-ve">AB-ve</SelectItem>
                    <SelectItem value="A-ve">A-ve</SelectItem>
                    <SelectItem value="B+ve">B+ve</SelectItem>
                    <SelectItem value="B-ve">B-ve</SelectItem>
                    <SelectItem value="O+ve">O+ve</SelectItem>
                    <SelectItem value="O-ve">O-ve</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your Blood group?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="patientType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Patient Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Patient Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="infant">Infant</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the Patient Type</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <FormControl>
                  <Controller
                    name="maritalStatus"
                    control={form.control}
                    render={({ field: controllerField }) => (
                      <div className="flex items-center space-x-4">
                        <label htmlFor="married">
                          <input
                            type="radio"
                            id="married"
                            value="married"
                            className="mr-1"
                            checked={controllerField.value === "married"} // Check if "married" is selected
                            onChange={() => controllerField.onChange("married")} // Update form state on change
                          />
                          Married
                        </label>
                        <label htmlFor="unmarried">
                          <input
                            type="radio"
                            id="unmarried"
                            value="unmarried"
                            className="mr-1"
                            checked={controllerField.value === "unmarried"} // Check if "unmarried" is selected
                            onChange={() =>
                              controllerField.onChange("unmarried")
                            } // Update form state on change
                          />
                          Unmarried
                        </label>
                      </div>
                    )}
                  />
                </FormControl>
                <FormDescription>What is your marital status?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priorityCard"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="checkbox"
                    {...field}
                    checked={showFields}
                    onChange={(e) => {
                      setShowFields(e.target.checked);
                      field.onChange(e); // Ensure that React Hook Form state updates
                    }}
                  />
                </FormControl>
                <FormLabel className="ml-2">Priority Card</FormLabel>
                <FormDescription>Do you have a priority card?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* s */}
          {showFields && (
            <>
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Value..." {...field} />
                    </FormControl>
                    <FormDescription>Enter the Value</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Percentage..." {...field} />
                    </FormControl>
                    <FormDescription>Enter Percentage</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        <div className="flex justify-end w-full ">
          <Button className="self-center mr-8" type="submit">
            Add patient
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SettingsProfilePage() {
  const navigate = useNavigate();
  return (
    <Card className="min-w-[350px] overflow-auto bg-light shadow-md pt-4 ">
      <Button
        onClick={() => navigate("/patientmaster")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Patient Master</CardTitle>
        <CardDescription>Patient master</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 ">
          <Separator />
          <ProfileForm />
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
    </Card>
  );
}

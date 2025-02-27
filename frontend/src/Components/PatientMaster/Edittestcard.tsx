import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
  age: z.union([z.string(), z.number()]).optional(),
  gender: z.string().optional(),
  ageType: z.string().optional(),
  patientType: z.string().optional(),
  bloodGroup: z.string().optional(),
  maritalStatus: z.string().optional(),
  priorityCard: z.boolean().optional(),
  value: z.union([z.number(), z.string()]).nullable().optional(),
  percentage: z.union([z.number(), z.string()]).nullable().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

// This can come from your database or API.

function ProfileForm({ formData }) {
  console.log("This is formData", formData);
  const defaultValues: Partial<PatientFormValues> = formData;

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const { id } = useParams();

  const { reset } = form;
  // const [showFields, setShowFields] = useState<Boolean>(false);
  const [showFields, setShowFields] = useState<boolean>(
    formData?.priorityCard ?? false
  ); // Initialize showFields based on priorityCard

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
  const salutation = form.watch("salutation");

  useEffect(() => {
    reset(formData); // Reset form with the new formData
    setShowFields(formData?.priorityCard ?? false); // Update showFields based on formData's priorityCard value
  }, [formData, reset]);

  const navigate = useNavigate();
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);
  console.log(formData.priorityCard);
  console.log("hellow", showFields);
  const dateOfBirth = form.watch("dateOfBirth");

  const handleDateChange = (date: Date | null) => {
    // Update dateOfBirth field when date is selected
    form.setValue("dateOfBirth", date ? date.toISOString() : null);
  };

  async function onSubmit(data: PatientFormValues) {
    // console.log("Sas", data);

    if (!data.priorityCard) {
      data.value = "";
      data.percentage = "";
    }
    await axios.put(`/api/patientmaster/update/${id}`, data).then((res) => {
      toast.success("Patient updated successfully");
      navigate("/patientmaster");
    });
  }

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
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>Upload a Logo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
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
                  // onValueChange={field.onChange}
                  onValueChange={(e) => {
                    form.setValue("salutation", e);
                    handleSalutationChange(e);
                  }}
                  className="w-full"
                  value={field.value}
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
                <FormDescription>What is your middle name?</FormDescription>
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
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Country" />
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
                  value={field.value}
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
                  value={field.value}
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
                <FormDescription>What is your country?</FormDescription>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-2 justify-start text-left font-normal",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2" />
                  {dateOfBirth ? (
                    format(new Date(dateOfBirth), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfBirth ? new Date(dateOfBirth) : null}
                  onSelect={handleDateChange} // Handle date change
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>What is your Date of birth.</FormDescription>
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
                <FormDescription>What is your Age?</FormDescription>
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
                <FormLabel>Select Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  // value={field.value}
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
                <FormDescription>What is your gender?</FormDescription>
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
                <FormLabel>select Age Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Age Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>What is your Age Type?</FormDescription>
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
                <FormLabel>select Blood Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood Group" />
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
                <FormDescription>What is your Blood Group?</FormDescription>
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
                  value={field.value}
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
                <FormLabel>Priority Card</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    {...field}
                    onChange={(e) => {
                      setShowFields(e.target.checked);
                      field.onChange(e); // Ensure that React Hook Form state updates
                    }}
                  />
                </FormControl>
                <FormDescription>Do you have a priority card?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {showFields && (
            <div>
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
            </div>
          )}
        </div>
        <div className="flex justify-end w-full ">
          <Button className="self-center mr-8" type="submit">
            Save patients
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SettingsProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<any>({});
  const [showFields, setShowFields] = useState<Boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/patientmaster/reference/${id}`);
      console.log(response.data);
      setFormData(response.data);
    };
    if (id) {
      fetchData();
    }
    return () => {
      setFormData({});
    };
  }, [id]);
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
          <ProfileForm formData={formData} />
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
    </Card>
  );
}

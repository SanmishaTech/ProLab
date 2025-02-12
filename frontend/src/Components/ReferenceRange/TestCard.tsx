import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Editor } from "@/Components/Editor/Editor";

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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const profileFormSchema = z.object({
  parameter: z.string().optional(),
  testName: z.string().optional(),
  gender: z.string().optional(),
  agefrom: z.string().optional(),
  ageto: z.string().optional(),
  agetype: z.string().optional(),
  normalRange: z.string().optional(),
  normalRangeHi: z.string().optional(),
  normalRangeLow: z.string().optional(),
  criticalRange: z.string().optional(),
  criticalRangeHi: z.string().optional(),
  criticalRangeLow: z.string().optional(),
  remark: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {};

function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const [content, setContent] = useState("");
  const [consent, setconsent] = useState("");
  const [interpretation, setinterpretation] = useState("");
  const [specimen, setSpecimen] = useState<any[]>([]);
  const [department, setDepartment] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const parameterValue = form.watch("parameter");
  const [associates, setAssociates] = useState<any[]>([]);
  const [apidata, setapidata] = useState<any>();
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await axios.get(
  //         `/api/referencerange/allReference/${parameterValue}/${User?._id}`
  //       );
  //       console.log(response.data);
  //       setapidata(response.data);
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        const response = await axios.get(
          `/api/parameter/allparameter/${User?._id}`
        );
        console.log(response.data);
        setSpecimen(response.data);
      } catch (error) {
        console.error("Error fetching specimen:", error);
      }
    };
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `/api/department/alldepartment/${User?._id}`
        );
        console.log(response.data);
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchDepartment();
    fetchSpecimen();
  }, []);

  useEffect(() => {
    if (parameterValue) {
      console.log("Parameter value changed:", parameterValue);
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `/api/referencerange/allReference/${parameterValue}/${User?._id}`
          );
          console.log("Data based on parameter:", response.data);
          // Update the apidata state so that the table can render the data
          setapidata(response.data);
        } catch (error) {
          console.error("Error fetching data for parameter:", error);
        }
      };

      fetchData();
    }
  }, [parameterValue]);

  const navigate = useNavigate();

  async function onSubmit(data: ProfileFormValues) {
    // console.log("Sas", data);
    console.log("ppappappa", data);
    data.remark = content;

    data.userId = User?._id;

    await axios.post(`/api/referencerange`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Reference Range Created Successfully");
      navigate("/referencerange");
    });
  }

  useEffect(() => {
    console.log("This is formData", formData);
  }, [formData]);

  const getformdatafromnextcomponent = (data) => {
    console.log("Received data:", data);
    setFormData(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 pb-[2rem]"
      >
        {" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="parameter"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Parameters</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="w-full"
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select parameter type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specimen?.map((specimen) => (
                      <SelectItem key={specimen._id} value={specimen._id}>
                        {specimen.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select parameter you want to use.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="testName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Name</FormLabel>
                <FormControl>
                  <Input placeholder="Test name..." {...field} />
                </FormControl>
                <FormDescription>What is Test name?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Table className="min-w-full border border-slate-200 rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Gender</TableHead>
              <TableHead className="text-center">Age From</TableHead>
              <TableHead className="text-right">Age To</TableHead>
              <TableHead className="text-right">Age Type</TableHead>
              <TableHead className="text-center">Normal Range Hi</TableHead>
              <TableHead className="text-center">Normal Range Low</TableHead>
              <TableHead className="text-center">Normal Range Def</TableHead>
              <TableHead className="text-center">Critical Range Hi</TableHead>
              <TableHead className="text-center">Critical Range Low</TableHead>
              <TableHead className="text-center">Critical Range Def</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apidata &&
              apidata.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-left">{item.gender}</TableCell>
                  <TableCell className="text-center">{item.agefrom}</TableCell>
                  <TableCell className="text-center">{item.ageto}</TableCell>
                  <TableCell className="text-right">{item.agetype}</TableCell>
                  <TableCell className="text-center">
                    {item.normalRange}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.normalRangeHi}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.normalRangeLow}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.criticalRange}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.criticalRangeHi}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.criticalRangeLow}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agefrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age from</FormLabel>
                <FormControl>
                  <Input placeholder="Age from..." {...field} />
                </FormControl>
                <FormDescription>What is Age from?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ageto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age To</FormLabel>
                <FormControl>
                  <Input placeholder="Age to..." {...field} />
                </FormControl>
                <FormDescription>What is Age to?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="agetype"
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
                      <SelectValue placeholder="Select a Age Type " />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="normalRange"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Normal Range</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Normal Range " />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="to">To</SelectItem>
                    <SelectItem value=">">{`>`}</SelectItem>
                    <SelectItem value=">=">{`>=`}</SelectItem>
                    <SelectItem value="<">{`<`}</SelectItem>
                    <SelectItem value="<=">{`<=`}</SelectItem>
                    <SelectItem value="=">{`=`}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="normalRangeHi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Normal Range From</FormLabel>
                <FormControl>
                  <Input placeholder="Normal Range From..." {...field} />
                </FormControl>
                <FormDescription>What is Normal Range From?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="normalRangeLow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Normal Range To</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Normal Range To</FormLabel>..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>What is Normal Range To?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="criticalRange"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Critical Range</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Critical Range " />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="to">To</SelectItem>
                    <SelectItem value=">">{`>`}</SelectItem>
                    <SelectItem value=">=">{`>=`}</SelectItem>
                    <SelectItem value="<">{`<`}</SelectItem>
                    <SelectItem value="<=">{`<=`}</SelectItem>
                    <SelectItem value="=">{`=`}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="criticalRangeHi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Critical Range From</FormLabel>
                <FormControl>
                  <Input placeholder="Critical Range From..." {...field} />
                </FormControl>
                <FormDescription>What is Critical Range From?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="criticalRangeLow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Critical Range To</FormLabel>
                <FormControl>
                  <Input placeholder="Critical Range To..." {...field} />
                </FormControl>
                <FormDescription>What is Critical Range To?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Label className="mb-2">Remark</Label>
          <Editor value={content} onChange={setContent} onBlur={setContent} />
        </div>
        <div className="flex justify-end w-full ">
          <Button className="self-center mr-8" type="submit">
            Add Profile
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
        onClick={() => navigate("/testmaster")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Reference Range Master</CardTitle>
        <CardDescription>Reference Rangemaster</CardDescription>
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

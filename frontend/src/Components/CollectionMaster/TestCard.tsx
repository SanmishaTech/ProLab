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
import MultiSelectorComponent from "./profile";

const profileFormSchema = z.object({
  collectionName: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  telephone: z.string().optional(),
  contactName1: z.string().optional(),
  contactName2: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  seperator: z.string().optional(),
  noOfDigits: z.string().optional(),
  startNumber: z.string().optional(),
  emailId: z.string().optional(),
  mobileNo: z.string().optional(),
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

  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        const response = await axios.get(
          `/api/specimen/allspecimen/${User?._id}`
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
  const navigate = useNavigate();

  async function onSubmit(data: ProfileFormValues) {
    console.log("Sas", data);

    data.userId = User?._id;
    console.log("ID is", data.userId);

    await axios.post(`/api/collectionmaster`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Test Master Created Successfully");
      navigate("/collectionmaster");
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
        className="space-y-8 pb-[2rem]"
      >
        {" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="collectionName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Collection Center</FormLabel>
                <Input placeholder="Collection Center..." {...field} />
                <FormDescription>
                  Enter Collection Center you want to use.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Textarea placeholder="Address Line 1..." {...field} />
                </FormControl>
                <FormDescription>What is Address Line 1?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 2</FormLabel>
                <FormControl>
                  <Textarea placeholder="Address Line 2..." {...field} />
                </FormControl>
                <FormDescription>What is Address Line 2?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country..." {...field} />
                </FormControl>
                <FormDescription>What is Country?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State..." {...field} />
                </FormControl>
                <FormDescription>What is State?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City..." {...field} />
                </FormControl>
                <FormDescription>What is City?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pinCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin Code</FormLabel>
                <FormControl>
                  <Input placeholder="Pin Code..." {...field} />
                </FormControl>
                <FormDescription>What is Pin Code?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input placeholder="Telephone..." {...field} />
                </FormControl>
                <FormDescription>What is Telephone?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            control={form.control}
            name="contactName1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name 1</FormLabel>
                <FormControl>
                  <Input placeholder="Contact Name 1..." {...field} />
                </FormControl>
                <FormDescription>What is Contact Name 1?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="contactName2"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Contact Name 2</FormLabel>
                <Input placeholder="Contact Name 1..." {...field} />

                <FormDescription>Select The department</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Prefix</FormLabel>
                <Input placeholder="Prefix..." {...field} />

                <FormDescription>Select The Prefix</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="suffix"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Suffix</FormLabel>
                <Input placeholder="Suffix..." {...field} />

                <FormDescription>Select The Suffix</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="seperator"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Seperator</FormLabel>
                <Input placeholder="Seperator..." {...field} />

                <FormDescription>Select The Seperator</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noOfDigits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No Of Digits</FormLabel>
                <FormControl>
                  <Input placeholder="No of Digits..." {...field} />
                </FormControl>
                <FormDescription>What is No Of Digits?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Number</FormLabel>
                <FormControl>
                  <Input placeholder="Start Number..." {...field} />
                </FormControl>
                <FormDescription>What is your Start Number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailId"
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
          <FormField
            control={form.control}
            name="mobileNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile No</FormLabel>
                <FormControl>
                  <Input placeholder="Mobile no..." {...field} />
                </FormControl>
                <FormDescription>What is your Mobile No.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
        onClick={() => navigate("/collectionmaster")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Collection Master</CardTitle>
        <CardDescription>Collection master</CardDescription>
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

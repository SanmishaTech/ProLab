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
  template: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  abbrivation: z.string().optional(),
  specimen: z.string().optional(),
  price: z.any().optional(),
  department: z.string().optional(),
  profile: z.boolean().optional(),
  isFormTest: z.boolean().optional(),
  sortOrder: z.number().optional(),
  machineInterface: z.boolean().optional(),
  isSinglePageReport: z.boolean().optional(),
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
  //   const { fields, append } = useFieldArray({
  //     name: "urls",
  //     control: form.control,
  //   });

  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        const response = await axios.get(`/api/specimen/allspecimen`);
        console.log(response.data);
        setSpecimen(response.data);
      } catch (error) {
        console.error("Error fetching specimen:", error);
      }
    };
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(`/api/department/alldepartment`);
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
    // console.log("Sas", data);
    console.log("ppappappa");
    data.prerquisite = content;
    data.consentForm = consent;
    data.interpretedText = interpretation;
    data.profile = formData;

    await axios.post(`/api/testmaster`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Profile updated successfully");
      navigate("/testmaster");
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
            name="template"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Associate</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="w-full"
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Associate type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select Associate you want to use.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
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
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Code</FormLabel>
                <FormControl>
                  <Input placeholder="Test code..." {...field} />
                </FormControl>
                <FormDescription>What is Test Code?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="abbrivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abbrivation</FormLabel>
                <FormControl>
                  <Input placeholder="Abbrivation..." {...field} />
                </FormControl>
                <FormDescription>What is abbrivation?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="specimen"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Specimen</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Specimen " />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specimen?.map((specimen) => (
                      <SelectItem key={specimen._id} value={specimen._id}>
                        {specimen.specimen}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the Specimen</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className=" p-4 space-y-4">
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Prereqizite
          </Label>
          <Editor value={content} onChange={setContent} onBlur={setContent} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-full p-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Price..." {...field} />
                </FormControl>
                <FormDescription>What is your name of Price.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Department " />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {department?.map((department) => (
                      <SelectItem key={department._id} value={department._id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select The department</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Label>Consent Form</Label>
          <Editor value={consent} onChange={setconsent} onBlur={setconsent} />
        </div>
        <div>
          <Label>Interpretetion Text</Label>
          <Editor
            value={interpretation}
            onChange={setinterpretation}
            onBlur={setinterpretation}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-full p-4">
          <MultiSelectorComponent setData={getformdatafromnextcomponent} />{" "}
        </div>
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
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
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telephone</FormLabel>
                <FormControl>
                  <Input placeholder="Telephone..." {...field} />
                </FormControl>
                <FormDescription>
                  What is your name of Telephone
                </FormDescription>
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
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input placeholder="Degree..." {...field} />
                </FormControl>
                <FormDescription>What is your name of Degree.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
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
        <CardTitle>Test Master</CardTitle>
        <CardDescription>Test master</CardDescription>
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

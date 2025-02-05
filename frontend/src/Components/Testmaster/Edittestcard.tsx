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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "react-router-dom";
import MultiSelectorComponent from "./profile";
import { useNavigate } from "react-router-dom";
const profileFormSchema = z.object({
  template: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  abbrivation: z.string().optional(),
  specimen: z.string().optional(),
  price: z.any().optional(),
  department: z.string().optional(),
  profile: z.any().optional(),
  isFormTest: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  machineInterface: z.boolean().optional(),
  isSinglePageReport: z.boolean().optional(),
  suffix: z.string().optional(),
  hidedurationregistration: z.boolean().optional(),
  longdurationtests: z.boolean().optional(),
  outsource: z.boolean().optional(),
  singlepagereport: z.boolean().optional(),
  outsideAssociates: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {};

function ProfileForm({ formData }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const { id } = useParams();
  const { reset } = form;
  const {
    formState: { errors },
  } = form;

  const [content, setContent] = useState("");
  const [consent, setconsent] = useState("");
  const [interpretation, setinterpretation] = useState("");
  const [specimen, setSpecimen] = useState([]);
  const [department, setDepartment] = useState([]);
  const [profile, setProfile] = useState([]);
  const [formdata1, setFormData1] = useState([]);
  const [associates, setAssociates] = useState([]);
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

  const getformdatafromnextcomponent = (data) => {
    console.log(data);
    setFormData1(data);
  };

  useEffect(() => {
    console.log("This is errors", errors);
  }, [errors]);
  useEffect(() => {
    reset({
      ...formData,
      specimen: formData.specimen?._id,
      department: formData.department?._id,
      outsideAssociates: formData.outsideAssociates?._id,
    });
    setContent(formData?.prerquisite);
    setconsent(formData?.consentForm);
    setinterpretation(formData?.interpretedText);
  }, [formData, reset]);
  //   const { fields, append } = useFieldArray({
  //     name: "urls",
  //     control: form.control,
  //   });
  const navigate = useNavigate();

  async function onSubmit(data: ProfileFormValues) {
    console.log("Sas", data);
    console.log("ppappappa");
    data.prerequisite = content;
    data.consentForm = consent;
    data.interpretedText = interpretation;
    data.profile = formdata1;
    data.userId = User?._id;

    await axios.put(`/api/testmaster/update/${id}`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Test Master Updated Successfully");
      navigate("/testmaster");
    });
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `/api/associatemaster/allassociates/${User?._id}`
        );
        console.log(response.data);
        setAssociates(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

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
                  This is the type of Associate you are selecting.
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
                <FormDescription>What is your Test name?</FormDescription>
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
                <FormDescription>What is your Test Code?</FormDescription>
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
                  value={field.value}
                  defaultValue={formData?.specimen?._id}
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
                <FormDescription>What is your country?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="outsideAssociates"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Outside Associates</FormLabel>
                {console.log("fieldvalue", field.value)}

                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Outside Associates " />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {associates?.map((associates) => (
                      <SelectItem key={associates._id} value={associates._id}>
                        {associates.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 items-center pl-4">
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="outsource"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      id="outsource"
                      className="mr-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="outsource"
                    className="text-md text-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Outsource
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="longdurationtests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      id="longdurationtests"
                      className="mr-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="longdurationtests"
                    className="text-md text-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                  >
                    Long Duration Test
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="hidedurationregistration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      id="hidedurationregistration"
                      className="mr-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="hidedurationregistration"
                    className="text-md text-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-4"
                  >
                    Hide During Registration
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
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
                  value={field.value}
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
                <FormDescription>
                  What Department you belong to?
                </FormDescription>
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
        <div className="flex items-center space-x-2  gap-[4rem]">
          <MultiSelectorComponent
            setData={getformdatafromnextcomponent}
            existingvalues={formData}
          />
          <div className="flex items-center space-x-2 jutify-center">
            <FormField
              control={form.control}
              name="isSinglePageReport"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      id="isSinglePageReport"
                      className="mr-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="isSinglePageReport"
                    className="text-md text-center  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Single Page Report
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
          <div className="flex items-center space-x-2 justify-center ">
            <FormField
              control={form.control}
              name="isFormTest"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      id="isFormTest"
                      className="mr-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="isFormTest"
                    className="text-md text-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Is Form Test
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
        </div>
        <div className="flex items-center space-x-2  gap-[4rem]">
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    className="min-w-[20rem]"
                    placeholder="sortOrder..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="machineInterface"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    id="machineInterface"
                    className="mr-2"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    defaultChecked={field.value}
                  />
                </FormControl>
                <FormLabel
                  htmlFor="machineInterface"
                  className="text-md text-center font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Machine Interface
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            className="ml-[10rem] "
            control={form.control}
            name="suffix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Suffix for barcode (Use , as separator Ex: -1,-2,-3) :
                </FormLabel>
                <FormControl>
                  <Input placeholder="Suffix..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end w-full ">
          <Button className="self-center mr-8" type="submit">
            Update profile
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SettingsProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/testmaster/reference/${id}`);
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

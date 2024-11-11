import { useState } from "react";
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

const profileFormSchema = z.object({
  template: z.string().optional(),
  name: z.string().optional(),
  testCode: z.string().optional(),
  abbrivation: z.string().optional(),
  specimen: z.string().optional(),
  prerequisite: z.string().optional(),
  price: z.number().optional(),
  department: z.string().optional(),
  consentForm: z.string().optional(),
  interpretedText: z.string().optional(),
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
  //   const { fields, append } = useFieldArray({
  //     name: "urls",
  //     control: form.control,
  //   });
  const navigate = useNavigate();

  async function onSubmit(data: ProfileFormValues) {
    // console.log("Sas", data);
    console.log("ppappappa");
    // Implement actual profile update logic here
    await axios.post(`/api/associatemaster`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Profile updated successfully");
      navigate("/associatemaster");
    });
  }

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
                <FormLabel>Associate Type</FormLabel>
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
            name="testCode"
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
                  <Input placeholder="abbrivation..." {...field} />
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
                <FormLabel>select Specimen</FormLabel>
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
                    <SelectItem value="china">China</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                    <SelectItem value="france">France</SelectItem>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-full p-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Address</FormLabel> */}
                <FormControl className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>What is your name of Address</FormDescription>
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
  return (
    <Card className="min-w-[350px] overflow-auto bg-light shadow-md pt-4 ">
      <Button
        onClick={() => navigate("/associatemaster")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Associate Master</CardTitle>
        <CardDescription>Associate master</CardDescription>
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

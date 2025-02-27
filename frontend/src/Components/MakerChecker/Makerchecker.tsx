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
import { MultipleSelect } from "@/components/ui/multiple-select";
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

const profileFormSchema = z.object({
  test: z.any().optional(),
  checker: z.string().optional(),
  level: z.string().optional(),
  department: z.string().optional(),
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
  const [checker, setChecker] = useState("");
  const [specimen, setSpecimen] = useState<any[]>([]);
  const [department, setDepartment] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const parameterValue = form.watch("parameter");
  const [associates, setAssociates] = useState<any[]>([]);
  const [apidata, setapidata] = useState<any>();
  const [defaultdata, setdefaultdata] = useState<any>();

  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        console.log(response.data);
        const data = response.data;
        const convertData = data.map((item) => {
          return {
            key: item._id,
            name: item.name,
          };
        });
        setSpecimen(convertData);
      } catch (error) {
        console.error("Error fetching specimen:", error);
      }
    };

    const fetchDepartment = async () => {
      try {
        const response = await axios.get(`/api/users/user/allusers`);
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
    console.log("Parameter value changed:", parameterValue);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/department/alldepartment/${User?._id}`
        );
        console.log("Data based on parameter:", response.data);
        // Update the apidata state so that the table can render the data
        setapidata(response.data);
      } catch (error) {
        console.error("Error fetching data for parameter:", error);
      }
    };

    fetchData();
  }, [parameterValue]);

  const navigate = useNavigate();

  async function onSubmit(data: ProfileFormValues) {
    // console.log("Sas", data);
    console.log("ppappappa", data);
    data.remark = content;

    data.userId = User?._id;
    console.log("data", data);

    await axios.post(`/api/makerchecker`, data).then((res) => {
      console.log("ppappappa", res.data);
      toast.success("Test Master Created Successfully");
      navigate("/makerchecker");
    });
  }

  useEffect(() => {
    console.log("This is formData", formData);
  }, [formData]);

  useEffect(() => {
    if (checker) {
      console.log("click");
      // When checker is true, set the test field to all specimen keys
      form.setValue(
        "test",
        specimen.map((item) => item.key)
      );
      setdefaultdata(
        specimen.map((item) => {
          return {
            key: item.key,
            name: item.name,
          };
        })
      );
    }
    if (checker === false) {
      console.log("Noclick");
      setdefaultdata([]);
      // Otherwise, clear the test field
      form.setValue("test", []);
    }
  }, [checker]);

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
            name="department"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="w-full"
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {apidata?.map((specimen) => (
                      <SelectItem key={specimen._id} value={specimen._id}>
                        {specimen.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select Department you want to use.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            className="flex-1"
            control={form.control}
            name="checker"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select Checker</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="w-full"
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Checker type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {department?.map((specimen) => (
                      <SelectItem key={specimen._id} value={specimen._id}>
                        {specimen.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select checker you want to use.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  className="w-full"
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="level1">Level1</SelectItem>
                    <SelectItem value="level2">Level2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="default"
            render={({ field }) => (
              <FormItem className="w-full flex gap-2 items-center text-center">
                <FormLabel>Select All Tests</FormLabel>
                <FormControl>
                  <Checkbox
                    id="default"
                    defaultValue={formData.defaultValue}
                    checked={checker}
                    onCheckedChange={(checked) =>
                      setChecker(checked as boolean)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col items-center min-w-full  ">
          <FormField
            control={form.control}
            name="test"
            render={({ field }) => (
              <FormItem className="w-full pl-4">
                <FormLabel>Tests</FormLabel>
                <FormControl>
                  <MultipleSelect
                    key={JSON.stringify(defaultdata)} // Changing key forces remount
                    className="min-w-full"
                    tags={specimen}
                    value={
                      // Convert the keys back to the objects expected by MultipleSelect
                      specimen.filter((item) => field.value?.includes(item.key))
                    }
                    defaultValue={defaultdata}
                    onChange={(res) => {
                      console.log(res);
                      field.onChange(res.map((item) => item.key));
                    }}
                  />
                </FormControl>
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

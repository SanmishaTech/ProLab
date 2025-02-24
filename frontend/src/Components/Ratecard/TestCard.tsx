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
import Tablecomponent from "./Tablecomponent";

const profileFormSchema = z.object({
  associate: z.string().optional(),
  department: z.string().optional(),
  test: z
    .array(
      z.object({
        testId: z.string(),
        price: z.number(),
        percentage: z.number(),
      })
    )
    .optional(),
  value: z.any().optional(),
  userId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  test: [],
};

function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const [content, setContent] = useState("");
  const [consent, setconsent] = useState("");
  const [interpretation, setinterpretation] = useState("");
  const [testmaster, settestmaster] = useState<any[]>([]);
  const [department, setDepartment] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [associates, setAssociates] = useState<any[]>([]);
  const [updatedtests, setUpdatedtests] = useState<any[]>([]);
  const [percentagevalue, setPercentagevalue] = useState<any[]>([]);
  const [conflictchecks, setconflictchecks] = useState<any[]>([]);
  let alltests;

  const { watch } = form;
  const watchedAssociate = watch("associate");
  const watchDepartment = watch("department");
  // const watchedAssociate = form.watch("associate");

  // Whenever "associate" changes, trigger this useEffect
  useEffect(() => {
    console.log("Associate value changed:", watchedAssociate);
    if (!watchedAssociate) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `/api/service/getassociate/${watchedAssociate}/${
            User?._id
          }?departmentId=${watchDepartment ? watchDepartment : ""}`
        );
        console.log("Fetched on associate change:", response.data[0].test);
        const updatedtestadded = response.data[0]?.test.map((item) => {
          let updatedtest = item.testId;
          let newitem = {
            testId: {
              ...updatedtest,
              price: item.price ?? item?.testId?.price,
              originalPrice: item?.testId?.price ?? item.price,
            },
            price: item.price,
            percentagevalue: item.percentage,
          };
          return newitem;
        });

        const testspecialarrray = updatedtestadded.map((item) => {
          return item.testId;
        });
        console.log("Updatedtestadded", updatedtestadded);
        setconflictchecks(updatedtestadded);
        setUpdatedtests(testspecialarrray);
        settestmaster(testspecialarrray);

        // Update the test values if they exist
        // if (response.data && response.data.length > 0) {
        //   const associateTests = response.data[0]?.test || [];
        //   const updatedTestMaster = testmaster.map((test) => {
        //     const savedTest = associateTests.find(
        //       (at) => at.testId === test._id
        //     );
        //     if (savedTest) {
        //       return {
        //         ...test,
        //         price: savedTest.price,
        //         originalPrice: test.price, // Keep original price for reference
        //       };
        //     }
        //     return test;
        //   });
        //   settestmaster(updatedTestMaster);
        // }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [watchedAssociate, watchDepartment, User?._id]);

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

  useEffect(() => {
    const fetchSpecimen = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        console.log("This is tetdata", response.data);
        settestmaster(response.data);
        alltests = response.data;
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
    const formattedData = {
      associate: data.associate,
      department: data.department,
      test: updatedtests?.map((item) => ({
        testId: item._id,
        price: item.price,
        percentage: percentagevalue,
      })),
      userId: User?._id,
    };

    try {
      const response = await axios.post(`/api/service`, formattedData);
      console.log("Service saved:", response.data);
      toast.success("Service Payable Created Successfully");
      navigate("/service");
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to create Service Payable");
    }
  }

  const getformdatafromnextcomponent = (data) => {
    setFormData(data);
  };

  const handleUpdateTests = async (
    testsToUpdate: any[],
    discountPercentage: number
  ) => {
    try {
      const formattedData = {
        associate: watchedAssociate,
        department: form.getValues("department"),
        test: testsToUpdate.map((item) => ({
          testId: item._id,
          price: item.price,
          percentage: discountPercentage,
        })),
        userId: User?._id,
      };

      const response = await axios.put(
        `/api/service/updatetests/${watchedAssociate}/${User?._id}`,
        formattedData
      );

      if (response.data) {
        toast.success("Test values updated successfully");
        // Refresh the test values
        const updatedTestMaster = testmaster.map((test) => {
          const updatedTest = testsToUpdate.find((ut) => ut._id === test._id);
          if (updatedTest) {
            return {
              ...test,
              price: updatedTest.price,
              originalPrice: test.price,
            };
          }
          return test;
        });
        settestmaster(updatedTestMaster);
      }
    } catch (error) {
      console.error("Error updating test values:", error);
      toast.error("Failed to update test values");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pb-[2rem]"
      >
        {" "}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="associate"
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
                      <SelectValue placeholder="Select Associate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {associates?.map((associate) => {
                      return (
                        <SelectItem value={associate?._id}>
                          {associate.firstName}
                        </SelectItem>
                      );
                    })}
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
            className="flex-1"
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Department</FormLabel>
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
                    {department?.map((department) => {
                      return (
                        <SelectItem value={department?._id}>
                          {department.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select Department you want to use.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full">
          <Tablecomponent
            data={testmaster}
            setUpdatedtests={setUpdatedtests}
            setPercentagevalue={setPercentagevalue}
            conflictchecks={conflictchecks}
            onUpdateTests={handleUpdateTests}
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
        onClick={() => navigate("/service")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Service Payable</CardTitle>
        <CardDescription>Service Payable</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 ">
          <Separator />
          <ProfileForm />
        </div>
      </CardContent>
    </Card>
  );
}

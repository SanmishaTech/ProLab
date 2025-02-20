import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MoveLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { Trash } from "lucide-react";
import { Item } from "@radix-ui/react-accordion";

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
  template: z.string().optional(), // Add this line
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  test: [],
};

const updatedData = (data: any[]) => {
  let j = 0;
  for (let i = 0; i < data.length; i++) {
    let obj = data[i];
    if (
      obj.columnName !== "" &&
      obj.columnName !== null &&
      obj.columnName !== undefined &&
      obj.columnType !== "" &&
      obj.columnType !== null &&
      obj.columnType !== undefined &&
      obj.sortOrder !== "" &&
      obj.sortOrder !== null &&
      obj.sortOrder !== undefined
    ) {
      // Move the valid object to the 'j'th position
      data[j] = obj;
      j++;
    }
  }
  // Truncate the array to remove extra elements (including empty objects)
  data.length = j;
  return data;
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
  const [templates, setTemplates] = useState<any[]>([{}]);

  const { watch } = form;
  const watchedAssociate = watch("associate");
  // const watchedAssociate = form.watch("associate");

  // Whenever "associate" changes, trigger this useEffect
  useEffect(() => {
    console.log("Associate value changed:", watchedAssociate);
    if (!watchedAssociate) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `/api/service/getassociate/${watchedAssociate}/${User?._id}`
        );
        console.log("Fetched on associate change:", response.data);
        setconflictchecks(response.data);

        // Update the test values if they exist
        if (response.data && response.data.length > 0) {
          const associateTests = response.data[0]?.test || [];
          const updatedTestMaster = testmaster.map((test) => {
            const savedTest = associateTests.find(
              (at) => at.testId === test._id
            );
            if (savedTest) {
              return {
                ...test,
                price: savedTest.price,
                originalPrice: test.price, // Keep original price for reference
              };
            }
            return test;
          });
          settestmaster(updatedTestMaster);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [watchedAssociate, User?._id]);

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
        console.log(response.data);
        settestmaster(response.data);
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
    const updatedata = updatedData(templates);
    const formattedData = {
      data: updatedata || [],
      template: data.template,
      userId: User?._id,
    };

    try {
      const response = await axios.post(`/api/template`, formattedData);
      console.log("Template saved:", response.data);
      toast.success("Template Payable Created Successfully");
      navigate("/template");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to create template Payable");
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

  useEffect(() => {
    console.log("Templates", templates);
  }, [templates]);

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
            name="template"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Template</FormLabel>
                <Input placeholder="Template..." {...field} />
                <FormDescription>
                  Select Template you want to use.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="bg-background">
          <div className="overflow-hidden rounded-lg border border-border bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9 py-2">Column Header</TableHead>
                  <TableHead className="h-9 py-2">Column Type</TableHead>
                  <TableHead className="h-9 py-2">Sort Order</TableHead>
                  <TableHead className="h-9 py-2">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-2 font-medium">
                      <Input
                        placeholder="Name..."
                        value={template.columnName}
                        onChange={(e) => {
                          const newTemplates = [...templates];
                          newTemplates[index].columnName = e.target.value;
                          setTemplates(newTemplates);
                          // If editing the last row and the value is non-empty, add a new row
                          if (
                            index === templates.length - 1 &&
                            e.target.value.trim() !== ""
                          ) {
                            setTemplates((prev) => [
                              ...prev,
                              {
                                columnName: "",
                                columnType: null,
                                sortOrder: "",
                              },
                            ]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <Select
                        value={template.columnType || ""}
                        onValueChange={(value) => {
                          const newTemplates = [...templates];
                          newTemplates[index].columnType = value;
                          setTemplates(newTemplates);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Value">Value</SelectItem>
                          {/* Add more options as needed */}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        placeholder="Sort Order..."
                        value={template.sortOrder}
                        onChange={(e) => {
                          const newTemplates = [...templates];
                          newTemplates[index].sortOrder = e.target.value;
                          setTemplates(newTemplates);
                        }}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <Button
                        type="button"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          // Remove the row at the given index
                          const newTemplates = templates.filter(
                            (_, idx) => idx !== index
                          );
                          setTemplates(newTemplates);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <>
            <Button
              type="button"
              className="m-2 mt-5"
              onClick={() => {
                // Add a new row
                setTemplates((prev) => [
                  ...prev,
                  { columnName: "", columnType: null, sortOrder: "" },
                ]);
              }}
            >
              Add Profile
            </Button>
          </>
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
        onClick={() => navigate("/template")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>

      <CardHeader>
        <CardTitle>Template Master</CardTitle>
        <CardDescription>Template master</CardDescription>
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

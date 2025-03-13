import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
import { Select, SelectItem } from "@heroui/react";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import MultiSelectorComponent from "./profile";
import Tablecomponent from "./Tablecomponent";
import AlertDialogbox from "./conflictassociate/conflict";

// -----------------------------
// Updated Schema to include purchasePrice & saleRate
// -----------------------------
const profileFormSchema = z.object({
  associate: z.any().optional(),
  department: z.string().optional(),
  test: z
    .array(
      z.object({
        testId: z.string(),
        purchasePrice: z.number(),
        saleRate: z.number(),
        percentage: z.number(),
      })
    )
    .optional(),
  value: z
    .object({
      purchasePrice: z.number(),
      saleRate: z.number(),
    })
    .optional(),
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
  const [searchfilter, setsearchfilter] = useState("");
  const [FilteredTestData, setFilteredTestData] = useState<any[]>([]);
  const [conflictData, setConflictData] = useState();
  const [conflictopen, setconflictopen] = useState(false);
  const [Selectopen, setSelectopen] = useState(false);
  const [SelectedAssociate, setSelectedAssociate] = useState(null);
  const [conflictedselected, setconflictedselected] = useState();

  const { watch } = form;
  const watchedAssociate = watch("associate");
  const watchDepartment = watch("department");

  // When conflict data changes, update testmaster items with purchasePrice & saleRate
  useEffect(() => {
    testmaster.forEach((item) => {
      const findtestfromconflict = conflictedselected?.find((test) => {
        return test.testId === item._id;
      });
      if (findtestfromconflict) {
        // Update dual price values on the test master item
        settestmaster((prevTestMaster) =>
          prevTestMaster.map((test) =>
            test._id === item._id
              ? {
                  ...test,
                  purchasePrice: findtestfromconflict.unifiedPurchasePrice,
                  saleRate: findtestfromconflict.unifiedSaleRate,
                  originalPurchasePrice:
                    findtestfromconflict.unifiedPurchasePrice,
                  originalSaleRate: findtestfromconflict.unifiedSaleRate,
                }
              : test
          )
        );
      }
    });
  }, [conflictedselected]);

  // Whenever "associate" changes, trigger this useEffect
  useEffect(() => {
    const arrayValues2 = Array.from(watchedAssociate || []);
    if (!watchedAssociate) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `/api/ratecard/getassociate/${User?._id}?departmentId=${
            watchDepartment ? watchDepartment : ""
          }`,
          {
            associate: [
              ...new Set(
                arrayValues2.map((item) => item).filter((item) => item !== "")
              ),
            ],
          }
        );
        setConflictData(response.data);
        if (response.data?.hasConflicts) {
          setSelectopen(false);
          setconflictopen(true);
        }

        const updatedtestadded = response.data?.tests.map((item) => {
          let updatedtest = item.testId;
          let newitem = {
            testId: {
              defaultPurchasePrice: item?.defaultPurchasePrice,
              defaultSaleRate: item?.defaultSaleRate,
              conflicts: item?.prices,
              ...updatedtest,
              // Note: Adjust the property names from unifiedValue accordingly
              purchasePrice: item.unifiedValue?.purchasePrice,
              saleRate: item.unifiedValue?.saleRate,
              hasConflict: item?.hasConflict,
              originalPurchasePrice:
                item?.defaultPurchasePrice ?? item.testId?.purchasePrice,
              originalSaleRate: item?.defaultSaleRate ?? item.testId?.saleRate,
            },
            purchasePrice: item.unifiedValue?.purchasePrice,
            saleRate: item.unifiedValue?.saleRate,
            percentagevalue: item.percentage,
          };
          return newitem;
        });
        const testspecialarrray = updatedtestadded.map((item) => {
          return item.testId;
        });
        setconflictchecks(testspecialarrray);
        setUpdatedtests(testspecialarrray);
        settestmaster(testspecialarrray);
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
      } catch (error) {
        console.error("Error fetching specimen:", error);
      }
    };
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `/api/department/alldepartment/${User?._id}`
        );
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };
    fetchDepartment();
    fetchSpecimen();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    // Here you can process non-conflict associates data if needed.
    const nonconflictingdata = conflictData?.tests?.map((item) => {
      return item.nonConflictAssociates.map((assoc) => {
        return {
          associate: assoc._id,
          test: {
            testId: item.testId?._id,
            purchasePrice: item.unifiedValue?.purchasePrice,
            saleRate: item.unifiedValue?.saleRate,
            userId: User?._id,
            percentage: item.unifiedValue?.percentage || 0,
          },
        };
      });
    });
  }, [conflictedselected, watchedAssociate]);

  // -----------------------------
  // Updated onSubmit to include dual pricing in payloads
  // -----------------------------
  async function onSubmit(data: ProfileFormValues) {
    try {
      // Process non-conflicting associates
      const nonconflictingdata =
        conflictData &&
        conflictData?.tests?.flatMap((test) => {
          const updatedTest = updatedtests?.find(
            (uTest) => uTest._id === (test.testId?._id || test.testId)
          );
          // Check if either purchasePrice or saleRate has changed
          if (
            updatedTest &&
            (updatedTest?.purchasePrice !== test.unifiedValue?.purchasePrice ||
              updatedTest?.saleRate !== test.unifiedValue?.saleRate)
          ) {
            test.nonConflictAssociates.forEach(async (associate) => {
              await axios.post("/api/ratecard", {
                associate: [associate._id],
                test: {
                  testId: associate.testId?._id,
                  purchasePrice: updatedTest?.purchasePrice,
                  saleRate: updatedTest?.saleRate,
                  percentage: test.unifiedValue?.percentage || 0,
                },
                value: {
                  purchasePrice: updatedTest?.purchasePrice,
                  saleRate: updatedTest?.saleRate,
                },
                userId: User?._id,
              });
            });
          }
        });

      // Process conflicting associates
      const arrangeselecteddatawithconflict =
        conflictedselected &&
        conflictedselected?.map(async (item) => {
          const updatedTest = updatedtests?.find(
            (uTest) => uTest._id === item.testId
          );
          if (
            updatedTest &&
            (updatedTest?.purchasePrice !== item.unifiedValue?.purchasePrice ||
              updatedTest?.saleRate !== item.unifiedValue?.saleRate)
          ) {
            await axios.post("/api/ratecard", {
              associate: [item.associate._id],
              test: {
                testId: item.testId,
                purchasePrice: updatedTest?.purchasePrice,
                saleRate: updatedTest?.saleRate,
                percentage: updatedTest?.percentage,
              },
              value: {
                purchasePrice: updatedTest?.purchasePrice,
                saleRate: updatedTest?.saleRate,
              },
              userId: User?._id,
            });
          }
        });
    } catch (error) {
      console.error("Error processing associates:", error);
      toast.error("Failed to process some associates");
    }
  }

  // -----------------------------
  // Updated handleUpdateTests to include purchasePrice and saleRate
  // -----------------------------
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
          purchasePrice: item.purchasePrice,
          saleRate: item.saleRate,
          percentage: discountPercentage,
        })),
        userId: User?._id,
      };

      const response = await axios.put(
        `/api/ratecard/updatetests/${watchedAssociate}/${User?._id}`,
        formattedData
      );

      if (response.data) {
        toast.success("Test values updated successfully");
        const updatedTestMaster = testmaster.map((test) => {
          const updatedTest = testsToUpdate.find((ut) => ut._id === test._id);
          if (updatedTest) {
            return {
              ...test,
              purchasePrice: updatedTest.purchasePrice,
              saleRate: updatedTest.saleRate,
              originalPurchasePrice: test.purchasePrice,
              originalSaleRate: test.saleRate,
            };
          }
          return test;
        });
        // Optionally update testmaster state here if needed
        // settestmaster(updatedTestMaster);
      }
    } catch (error) {
      console.error("Error updating test values:", error);
      toast.error("Failed to update test values");
    }
  };

  // Filter the test data based on the search query.
  useEffect(() => {
    const filteredData = testmaster?.filter((item) => {
      return item?.name?.toLowerCase()?.includes(searchfilter?.toLowerCase());
    });
    setFilteredTestData(filteredData);
  }, [searchfilter, testmaster]);

  // Use form.watch to get the current value of the associate field

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pb-[2rem]"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-full p-4">
          <FormField
            className="flex-1"
            control={form.control}
            name="associate"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select
                  className="max-w-xs"
                  label="Associates"
                  placeholder="Select Associates"
                  selectedKeys={field.value}
                  variant="bordered"
                  isOpen={Selectopen}
                  selectionMode="multiple"
                  onSelectionChange={field.onChange}
                  onOpenChange={(open) => setSelectopen(open)}
                >
                  {associates.map((animal) => (
                    <SelectItem key={animal._id}>{animal.firstName}</SelectItem>
                  ))}
                </Select>
                <FormDescription>
                  Select Associates you want to Update.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-end">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full bg-slate-100 pl-10 border-muted focus-visible:ring-primary border-muted"
            value={searchfilter}
            onChange={(e) => setsearchfilter(e.target.value)}
          />
        </div>
        <div className="flex w-full">
          <Tablecomponent
            data={FilteredTestData}
            setUpdatedtests={setUpdatedtests}
            setPercentagevalue={setPercentagevalue}
            conflictchecks={conflictchecks}
            conflictData={conflictData}
            setSelectedAssociate={setSelectedAssociate}
            onUpdateTests={handleUpdateTests}
          />
        </div>
        <AlertDialogbox
          isOpen={conflictopen}
          onOpen={setconflictopen}
          conflictData={conflictData}
          setconflictedselected={setconflictedselected}
          conflictedselected={conflictedselected}
        />
        <div className="flex justify-end w-full">
          <Button className="self-center mr-8" type="submit">
            Add Rate Card
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SettingsProfilePage() {
  const navigate = useNavigate();
  return (
    <Card className="min-w-[350px] overflow-auto bg-light shadow-md pt-4">
      <Button
        onClick={() => navigate("/ratecard")}
        className="ml-4 flex gap-2 m-8 mb-4"
      >
        <MoveLeft className="w-5 text-white" />
        Back
      </Button>
      <CardHeader>
        <CardTitle>Rate Card</CardTitle>
        <CardDescription>Rate Card</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Separator />
          <ProfileForm />
        </div>
      </CardContent>
    </Card>
  );
}

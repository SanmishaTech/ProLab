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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Select, SelectItem } from "@heroui/react";

import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import MultiSelectorComponent from "./profile";
import Tablecomponent from "./Tablecomponent";
import AlertDialogbox from "./conflictassociate/conflict";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  value: z.any().optional(),
  userId: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  test: [],
};

// Define a proper interface for the conflictedselected type
type ConflictedSelected = Array<{
  testId: string;
  testName?: string;
  associate: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
  unifiedPurchaseRate?: number;
  unifiedSaleRate?: number;
  unifiedPercentage?: number;
  purchasePrice?: number;
  saleRate?: number;
  index?: number;
}>;

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
  const [conflictedselected, setconflictedselected] =
    useState<ConflictedSelected>([]);
  const [ratecardHistory, setRatecardHistory] = useState<any[]>([]);

  const { watch } = form;
  const watchedAssociate = watch("associate");
  const watchDepartment = watch("department");
  useEffect(() => {
    console.log("");
  }, [updatedtests]);

  useEffect(() => {
    console.log("Conflict selection updated:", conflictedselected);
    if (!conflictedselected || conflictedselected.length === 0) return;

    try {
      const updatedTestMaster = [...testmaster];

      // Update each test that has a conflict resolved
      conflictedselected.forEach((selectedConflict) => {
        if (!selectedConflict || !selectedConflict.testId) {
          console.warn("Skipping invalid conflict item:", selectedConflict);
          return;
        }

        console.log(
          "Processing conflict for test ID:",
          selectedConflict.testId
        );
        const testIndex = updatedTestMaster.findIndex(
          (test) => test._id === selectedConflict.testId
        );

        if (testIndex >= 0) {
          const test = updatedTestMaster[testIndex];
          // Use the unified rates or fallback to the conflict's rates with proper null/undefined checks
          const newPurchaseRate =
            selectedConflict.unifiedPurchaseRate !== undefined &&
            selectedConflict.unifiedPurchaseRate !== null
              ? selectedConflict.unifiedPurchaseRate
              : selectedConflict.purchasePrice !== undefined &&
                selectedConflict.purchasePrice !== null
              ? selectedConflict.purchasePrice
              : test.purchasePrice || 0;

          const newSaleRate =
            selectedConflict.unifiedSaleRate !== undefined &&
            selectedConflict.unifiedSaleRate !== null
              ? selectedConflict.unifiedSaleRate
              : selectedConflict.saleRate !== undefined &&
                selectedConflict.saleRate !== null
              ? selectedConflict.saleRate
              : test.saleRate || 0;

          // Ensure we never pass NaN
          const finalPurchaseRate = isNaN(newPurchaseRate)
            ? test.purchasePrice || 0
            : newPurchaseRate;
          const finalSaleRate = isNaN(newSaleRate)
            ? test.saleRate || 0
            : newSaleRate;

          console.log(
            `Updating test ${test.name || test._id}: Purchase rate: ${
              test.purchasePrice
            } → ${finalPurchaseRate}, Sale rate: ${
              test.saleRate
            } → ${finalSaleRate}`
          );

          // Update the test with the new rates
          updatedTestMaster[testIndex] = {
            ...test,
            purchasePrice: finalPurchaseRate,
            saleRate: finalSaleRate,
            originalPurchaseRate: finalPurchaseRate,
            originalSaleRate: finalSaleRate,
          };
        } else {
          console.warn(
            `Test with ID ${selectedConflict.testId} not found in the test master.`
          );
        }
      });

      console.log("Setting updated test master:", updatedTestMaster);

      // Set the updated test master
      settestmaster(updatedTestMaster);
      // Also update the updated tests array for form submission
      setUpdatedtests(updatedTestMaster);
    } catch (error) {
      console.error("Error processing conflict resolution:", error);
    }
  }, [conflictedselected]);

  // Whenever "associate" changes, trigger this useEffect
  useEffect(() => {
    const arrayValues2 = Array.from(watchedAssociate || []);
    console.log("Associate value as array:", arrayValues2);
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
        console.log("Fetched on associate change:", response.data);

        setConflictData(response.data);
        // setconflictopen(true);
        if (response.data?.hasConflicts) {
          setSelectopen(false);
          setconflictopen(true);
        }
        console.log("Watch associates", watchedAssociate);

        const updatedtestadded = response.data?.tests.map((item) => {
          let updatedtest = item.testId;
          let newitem = {
            testId: {
              purchasePrice:
                item?.defaultPurchaseRate || item?.testId?.purchasePrice,
              defaultSaleRate: item?.defaultSaleRate || item?.testId?.saleRate,
              conflicts: item?.prices,
              ...updatedtest,
              purchasePrice:
                item.unifiedValue?.purchasePrice || item.testId?.purchasePrice,
              saleRate: item.unifiedValue?.saleRate || item.testId?.saleRate,
              hasConflict: item?.hasConflict,
              originalPurchaseRate:
                item?.purchasePrice || item.testId?.purchasePrice,
              originalSaleRate: item?.defaultSaleRate || item.testId?.saleRate,
              rateHistory: item?.history || [],
            },
            purchasePrice:
              item.unifiedValue?.purchasePrice || item.testId?.purchasePrice,
            saleRate: item.unifiedValue?.saleRate || item.testId?.saleRate,
            percentagevalue: item.percentage,
          };
          return newitem;
        });
        // setConflictData(updatedtestadded);
        console.log("UPDATED", updatedtestadded);

        const testspecialarrray = updatedtestadded.map((item) => {
          return item.testId;
        });
        console.log("Updatedtestadded", testspecialarrray);
        setconflictchecks(testspecialarrray);
        setUpdatedtests(testspecialarrray);
        settestmaster(testspecialarrray);

        // Extract and set rate history if available
        if (response.data?.tests) {
          const allHistory = response.data.tests
            .filter((test) => test.history && test.history.length > 0)
            .map((test) => ({
              testId: test.testId._id,
              testName: test.testId.name,
              history: test.history,
            }));
          setRatecardHistory(allHistory);
        }
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
        // settestmaster(response.data);
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

  useEffect(() => {
    const nonconflictingdata = conflictData?.tests?.map((item) => {
      return item.nonConflictAssociates.map((items) => {
        return {
          associate: items._id,
          test: {
            testId: item.testId?._id,
            purchasePrice: item.unifiedValue?.purchasePrice,
            saleRate: item.unifiedValue?.saleRate,
            percentage: item?.unifiedValue?.percentage,
            userId: User?._id,
          },
        };
      });
    });
    console.log("Non conflicting data", conflictedselected);
  }, [conflictedselected, watchedAssociate]);

  // Modified onSubmit function
  async function onSubmit(data: ProfileFormValues) {
    try {
      // Keep track of successful and failed updates
      let successCount = 0;
      let errorCount = 0;

      console.log("Submitting rate card updates...");

      // Process non-conflicting and conflicting associates in parallel
      const nonconflictingdata =
        conflictData &&
        conflictData?.tests?.flatMap((test) => {
          // Find the updated test using testId
          const updatedTest = updatedtests?.find(
            (uTest) => uTest._id === (test.testId?._id || test.testId)
          );

          if (!updatedTest) return [];

          console.log(
            `Processing test: ${updatedTest.name || updatedTest._id}`
          );

          // Get non-conflict associates that need updates
          const filterupdatedtest =
            test?.nonConflictAssociates?.filter((testa) => {
              // Only update if the rates have changed
              return (
                testa.testId?._id === updatedTest?._id &&
                (testa?.value?.purchasePrice !== updatedTest?.purchasePrice ||
                  testa?.value?.saleRate !== updatedTest?.saleRate)
              );
            }) || [];

          console.log(
            `Found ${
              filterupdatedtest.length
            } non-conflicting associates to update for test ${
              updatedTest.name || updatedTest._id
            }`
          );

          console.log("PPPPPAPAP", filterupdatedtest);
          return filterupdatedtest.map(async (associate) => {
            try {
              if (
                updatedTest?.purchasePrice === undefined ||
                updatedTest?.saleRate === undefined
              ) {
                console.warn(`Missing rate data for test ${updatedTest?._id}`);
                return null;
              }

              // Ensure numeric values
              const purchasePrice =
                typeof updatedTest.purchasePrice === "number"
                  ? updatedTest.purchasePrice
                  : 0;
              const saleRate =
                typeof updatedTest.saleRate === "number"
                  ? updatedTest.saleRate
                  : 0;

              console.log(
                `Updating associate ${associate._id} for test ${updatedTest._id} with purchase rate: ${purchasePrice}, sale rate: ${saleRate}`
              );

              const response = await axios.post("/api/ratecard", {
                associate: [associate._id],
                test: {
                  testId: associate.testId?._id,
                  purchasePrice: purchasePrice,
                  saleRate: saleRate,
                  percentage: test.unifiedValue?.percentage || 0,
                },
                value: {
                  purchasePrice: purchasePrice,
                  saleRate: saleRate,
                },
                userId: User?._id,
              });

              if (response.status === 200) {
                successCount++;
              }

              return response;
            } catch (error) {
              console.error(
                `Error updating associate ${associate._id}:`,
                error
              );
              errorCount++;
              return null;
            }
          });
        });

      // Handle conflicted items that were resolved
      const conflictPromises =
        conflictedselected &&
        conflictedselected.map(async (item) => {
          try {
            const updatedTest = updatedtests?.find(
              (uTest) => uTest._id === item.testId
            );

            if (!updatedTest) {
              console.warn(`Test ${item.testId} not found in updated tests`);
              return null;
            }

            // Ensure numeric values
            const purchasePrice =
              typeof updatedTest.purchasePrice === "number"
                ? updatedTest.purchasePrice
                : 0;
            const saleRate =
              typeof updatedTest.saleRate === "number"
                ? updatedTest.saleRate
                : 0;

            console.log(
              `Updating conflict resolved associate ${item.associate._id} for test ${item.testId} with purchase rate: ${purchasePrice}, sale rate: ${saleRate}`
            );

            const response = await axios.post("/api/ratecard", {
              associate: [item.associate._id],
              test: {
                testId: item.testId,
                purchasePrice: purchasePrice,
                saleRate: saleRate,
                percentage: updatedTest?.percentage || 0,
              },
              value: {
                purchasePrice: purchasePrice,
                saleRate: saleRate,
              },
              userId: User?._id,
            });

            if (response.status === 200) {
              successCount++;
            }

            return response;
          } catch (error) {
            console.error(
              `Error updating conflict resolved associate ${item.associate._id}:`,
              error
            );
            errorCount++;
            return null;
          }
        });

      // Wait for all promises to resolve
      if (nonconflictingdata) {
        await Promise.all(nonconflictingdata.flat().filter(Boolean));
      }

      if (conflictPromises) {
        await Promise.all(conflictPromises.filter(Boolean));
      }

      if (errorCount > 0) {
        toast.warning(
          `Rate card updated with ${successCount} successes and ${errorCount} failures`
        );
      } else {
        toast.success("Rate card updated successfully");
      }

      // Refresh the data
      if (watchedAssociate) {
        // Re-fetch the data to show updated values
        const response = await axios.post(
          `/api/ratecard/getassociate/${User?._id}?departmentId=${
            watchDepartment ? watchDepartment : ""
          }`,
          {
            associate: Array.from(watchedAssociate).filter(
              (item) => item !== ""
            ),
          }
        );

        setConflictData(response.data);

        // Process the updated data
        const updatedTestsData = response.data?.tests.map((item) => {
          return {
            testId: {
              ...item.testId,
              purchasePrice:
                item.unifiedValue?.purchasePrice || item.testId?.purchasePrice,
              saleRate: item.unifiedValue?.saleRate || item.testId?.saleRate,
              originalPurchaseRate:
                item.purchasePrice || item.testId?.purchasePrice,
              originalSaleRate: item.defaultSaleRate || item.testId?.saleRate,
            },
          };
        });

        setUpdatedtests(updatedTestsData);
      }
    } catch (error) {
      console.error("Error processing associates:", error);
      toast.error("Failed to process rate card updates");
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
        // Refresh the test values
        const updatedTestMaster = testmaster.map((test) => {
          const updatedTest = testsToUpdate.find((ut) => ut._id === test._id);
          if (updatedTest) {
            return {
              ...test,
              purchasePrice: updatedTest.purchasePrice,
              saleRate: updatedTest.saleRate,
              originalPurchaseRate: test.purchasePrice,
              originalSaleRate: test.saleRate,
            };
          }
          return test;
        });
        // settestmaster(updatedTestMaster);
      }
    } catch (error) {
      console.error("Error updating test values:", error);
      toast.error("Failed to update test values");
    }
  };

  // Filter the test data based on the search query.
  // Adjust "name" to whichever property you wish to filter on.
  useEffect(() => {
    const filteredData = testmaster?.filter((item) => {
      return item?.name?.toLowerCase()?.includes(searchfilter?.toLowerCase());
    });
    console.log("Filter data", filteredData);
    setFilteredTestData(filteredData);
  }, [searchfilter, testmaster]);

  // Use form.watch to get the current value of the associate field
  const selectedAssociates = form.watch("associate") || [];

  // Calculate validSelectedKeys based on the watched value

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
                  isOpen={Selectopen} // control the open state externally
                  selectionMode="multiple"
                  onSelectionChange={field.onChange}
                  onOpenChange={(open) => {
                    setSelectopen(open);
                  }}
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

        {ratecardHistory.length > 0 && (
          <div className="w-full mt-4 relative z-10">
            <h3 className="text-lg font-medium mb-2">Rate Change History</h3>
            <div className="max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="font-medium">Test Name</TableCell>
                    <TableCell className="font-medium">Purchase Rate</TableCell>
                    <TableCell className="font-medium">Sale Rate</TableCell>
                    <TableCell className="font-medium">From Date</TableCell>
                    <TableCell className="font-medium">To Date</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ratecardHistory.flatMap((test) =>
                    test.history.map((historyItem, index) => (
                      <TableRow key={`${test.testId}-${index}`}>
                        <TableCell>{test.testName}</TableCell>
                        <TableCell>{historyItem.purchasePrice}</TableCell>
                        <TableCell>{historyItem.saleRate}</TableCell>
                        <TableCell>
                          {new Date(historyItem.fromDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {historyItem.toDate
                            ? new Date(historyItem.toDate).toLocaleDateString()
                            : "Current"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <AlertDialogbox
          isOpen={conflictopen}
          onOpen={setconflictopen}
          conflictData={conflictData as any}
          setconflictedselected={(selected) => {
            console.log("Selected conflicts:", selected);
            setconflictedselected(selected as any);
          }}
          conflictedselected={conflictedselected as any}
          url={`/api/ratecard/getassociate/${User?._id}`}
        />
        <div className="flex justify-end w-full">
          <Button className="self-center mr-8" type="submit">
            Update Rate Card
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
        <div className="space-y-6">
          <Separator />
          <ProfileForm />
        </div>
      </CardContent>
    </Card>
  );
}

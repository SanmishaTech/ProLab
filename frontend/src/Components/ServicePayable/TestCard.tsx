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

const profileFormSchema = z.object({
  associate: z.any().optional(),
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
  useEffect(() => {
    console.log("");
  }, [updatedtests]);

  useEffect(() => {
    console.log("Watched associate ppa", conflictedselected);
    testmaster.map((item) => {
      console.log("Item", item);
      // const findtest = item.test.find((test) => {
      //   console.log("Test", test);
      //   return test.testId === conflictedselected.testId;
      // });

      const findtestfromconflict = conflictedselected?.find((test) => {
        // console.log("Test", test);
        return test.testId === item._id;
      });
      console.log("Findtest", findtestfromconflict);

      if (findtestfromconflict) {
        console.log("Findtest", findtestfromconflict);
        item.price = findtestfromconflict.unifiedPrice;
        item.originalPrice = findtestfromconflict.unifiedPrice;
        // setUpdatedtests([...updatedtests, item]);
        settestmaster((prevTestMaster) =>
          prevTestMaster.map((test) =>
            // Replace `test.id` with your unique identifier property
            test._id === item._id
              ? {
                  ...test,
                  price: findtestfromconflict.unifiedPrice,
                  originalPrice: findtestfromconflict.unifiedPrice,
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
    console.log("Associate value as array:", arrayValues2);
    if (!watchedAssociate) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          `/api/service/getassociate/${User?._id}?departmentId=${
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
              defaultPrice: item?.defaultPrice,
              conflicts: item?.prices,
              ...updatedtest,
              price: item.unifiedValue?.price,
              hasConflict: item?.hasConflict,
              originalPrice: item?.defaultPrice ?? item.testId?.price,
            },

            price: item.unifiedValue?.price,
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
            price: item.unifiedValue?.price,
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
      // Process non-conflicting and conflicting associates in parallel

      const nonconflictingdata =
        conflictData &&
        conflictData?.tests?.flatMap((test) => {
          // Find the updated test using testId. Adjust the matching logic depending on your testId structure.
          const updatedTest = updatedtests?.find(
            (uTest) => uTest._id === (test.testId?._id || test.testId)
          );

          console.log("nonConflictAssociates", test);
          // const filterupdatedtest = test?.nonConflictAssociates.filter(
          //   (testa) => {
          //     const filterbyupdatetest = updatedtests?.filter((tests) => {
          //       console.log("filterupdatedtest", tests.price, testa);
          //       return (
          //         tests._id === testa.testId?._id &&
          //         tests.price !== test.unifiedValue?.price
          //       );
          //     });
          //     return filterbyupdatetest;
          //   }
          // );
          const filterupdatedtest = test?.nonConflictAssociates.filter(
            (testa) => {
              console.log(
                "testa",
                testa?.value?.price,
                updatedTest?.price,
                testa.testId?._id === updatedTest?._id &&
                  testa?.value?.price !== updatedTest?.price
              );
              return (
                testa.testId?._id === updatedTest?._id &&
                testa?.value?.price !== updatedTest?.price
              );
            }
          );
          console.log("filterupdatedtest", filterupdatedtest, updatedTest);
          filterupdatedtest.map(async (associate) => {
            console.log("Asscoaiii", test.unifiedValue?.price, associate);
            if (updatedTest?.price !== test.unifiedValue?.price) {
              await axios.post("/api/service", {
                associate: [associate._id],
                test: {
                  testId: associate.testId?._id,
                  price: updatedTest?.price,
                  percentage: test.unifiedValue?.percentage || 0, // Default if missing
                },
                value: updatedTest?.price,
                userId: User?._id,
              });
            } else {
              return;
            }
          });
        });

      console.log("Resulta", nonconflictingdata);

      const arrangeselecteddatawithconflict =
        conflictedselected &&
        conflictedselected?.map(async (item) => {
          const updatedTest = updatedtests?.find(
            (uTest) => uTest._id === item.testId
          );
          const unifiedvalue = conflictData?.tests?.map((tesa) => {
            console.log("tesa", tesa);
            return {
              price: tesa.unifiedValue?.price,
              testId: tesa.testId?._id,
            };
          });
          console.log("iteme", unifiedvalue, updatedTest?.price);
          if (unifiedvalue !== updatedTest?.price) {
            await axios.post("/api/service", {
              associate: [item.associate._id],
              test: {
                testId: item.testId,
                price: updatedTest?.price,

                percentage: updatedTest?.percentage,
              },
              value: updatedTest?.price,
              userId: User?._id,
            });
          } else {
            return;
          }
        });

      console.log("conflicting data", arrangeselecteddatawithconflict);

      console.log("aggregatedData", nonconflictingdata.length);
    } catch (error) {
      console.error("Error processing associates:", error);
      toast.error("Failed to process some associates");
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
        <AlertDialogbox
          isOpen={conflictopen}
          onOpen={setconflictopen}
          conflictData={conflictData}
          setconflictedselected={setconflictedselected}
          conflictedselected={conflictedselected}
        />
        <div className="flex justify-end w-full">
          <Button className="self-center mr-8" type="submit">
            Add Servicepayable
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

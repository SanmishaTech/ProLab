import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

// Define types for the component props
interface ConflictAssociate {
  _id: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  fullName?: string;
  value?: {
    purchaseRate?: number;
    purchasePrice?: number;
    saleRate?: number;
    percentage?: number;
  };
}

interface TestWithConflicts {
  testId: {
    _id: string;
    name: string;
    id?: string;
  };
  conflictAssociates: ConflictAssociate[];
  unifiedValue: {
    purchaseRate?: number;
    purchasePrice?: number;
    saleRate?: number;
    percentage?: number;
  };
}

interface ConflictData {
  tests: TestWithConflicts[];
  hasConflicts: boolean;
}

interface SelectedAssociate {
  testId: string;
  testName: string;
  associate: ConflictAssociate;
  index: number;
  unifiedPurchaseRate: number;
  unifiedSaleRate: number;
  unifiedPercentage?: number;
}

interface AlertDialogboxProps {
  url: string;
  backdrop?: string;
  isOpen: boolean;
  conflictData: ConflictData;
  setconflictedselected: (selected: SelectedAssociate[]) => void;
  conflictedselected?: SelectedAssociate[];
  onOpen: (open: boolean) => void;
  onClose?: () => void;
}

export default function AlertDialogbox({
  url,
  backdrop = "blur",
  isOpen,
  conflictData,
  setconflictedselected,
  conflictedselected,
  onOpen,
  onClose: propOnClose,
}: AlertDialogboxProps) {
  // Track which test rows are expanded
  const [openTests, setOpenTests] = useState<Record<string, boolean>>({});

  // Instead of storing a boolean value, we now store metadata objects for selected associates.
  const [selectedAssociates, setSelectedAssociates] = useState<
    Record<string, SelectedAssociate>
  >({});

  const queryClient = useQueryClient();

  // Handle modal close
  const onClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      onOpen(false);
    }
  };

  useEffect(() => {
    // Optional: Log the current metadata for selected associates for debugging.
    console.log("Selected Associates Metadata:", selectedAssociates);
  }, [selectedAssociates]);

  // When conflictData changes, clear out the selection.
  useEffect(() => {
    setSelectedAssociates({});
  }, [conflictData]);

  // Toggle expansion of a test row
  const toggleTestRow = (uniqueTestKey: string) => {
    setOpenTests((prev) => ({
      ...prev,
      [uniqueTestKey]: !prev[uniqueTestKey],
    }));
  };

  // Toggle selection of a specific associate.
  // Now we also pass in the test, associate, and index so we can save extra metadata.
  const toggleAssociateSelection = (
    associateId: string,
    test: TestWithConflicts,
    associate: ConflictAssociate,
    index: number
  ) => {
    setSelectedAssociates((prev) => {
      if (prev[associateId]) {
        // If already selected, remove it.
        const newSelections = { ...prev };
        delete newSelections[associateId];
        return newSelections;
      } else {
        // Otherwise, add a metadata object including unified value data.
        return {
          ...prev,
          [associateId]: {
            testId: test?.testId?._id || test?.testId?.name,
            testName: test?.testId?.name || "Unnamed Test",
            associate,
            index,
            unifiedPurchaseRate:
              test?.unifiedValue?.purchaseRate ||
              test?.unifiedValue?.purchasePrice ||
              0,
            unifiedSaleRate: test?.unifiedValue?.saleRate || 0,
            unifiedPercentage: test?.unifiedValue?.percentage,
          },
        };
      }
    });
  };

  // Toggle selection for all associates in a specific test.
  const toggleAllTestAssociates = (
    test: TestWithConflicts,
    isSelected: boolean
  ) => {
    if (test?.conflictAssociates) {
      const updatedSelections = { ...selectedAssociates };
      test.conflictAssociates.forEach((associate, index) => {
        const associateId = getAssociateKey(test, associate, index);
        if (isSelected) {
          updatedSelections[associateId] = {
            testId: test?.testId?._id || test?.testId?.name,
            testName: test?.testId?.name || "Unnamed Test",
            associate,
            index,
            unifiedPurchaseRate:
              test?.unifiedValue?.purchaseRate ||
              test?.unifiedValue?.purchasePrice ||
              0,
            unifiedSaleRate: test?.unifiedValue?.saleRate || 0,
            unifiedPercentage: test?.unifiedValue?.percentage,
          };
        } else {
          delete updatedSelections[associateId];
        }
      });
      setSelectedAssociates(updatedSelections);
    }
  };

  // Toggle selection for all associates across all tests.
  const toggleAllAssociates = (isSelected: boolean) => {
    const newSelections: Record<string, SelectedAssociate> = {};
    conflictData?.tests?.forEach((test) => {
      if (test.conflictAssociates) {
        test.conflictAssociates.forEach((associate, index) => {
          const associateId = getAssociateKey(test, associate, index);
          if (isSelected) {
            newSelections[associateId] = {
              testId: test?.testId?._id || test?.testId?.name,
              testName: test?.testId?.name || "Unnamed Test",
              associate,
              index,
              unifiedPurchaseRate:
                test?.unifiedValue?.purchaseRate ||
                test?.unifiedValue?.purchasePrice ||
                0,
              unifiedSaleRate: test?.unifiedValue?.saleRate || 0,
              unifiedPercentage: test?.unifiedValue?.percentage,
            };
          }
        });
      }
    });
    setSelectedAssociates(newSelections);

    // Optionally expand all tests when selecting all
    if (isSelected) {
      const newOpenTests: Record<string, boolean> = {};
      conflictData?.tests?.forEach((test, index) => {
        const testId = `${test.testId?.id || test.testId?.name}-${index}`;
        newOpenTests[testId] = true;
      });
      setOpenTests(newOpenTests);
    }
  };

  // Check if all associates of a specific test are selected.
  const areAllTestAssociatesSelected = (test: TestWithConflicts) => {
    if (!test?.conflictAssociates || test.conflictAssociates.length === 0)
      return false;

    return test.conflictAssociates.every((associate, index) => {
      const associateId = getAssociateKey(test, associate, index);
      return selectedAssociates[associateId];
    });
  };

  // Count selected associates
  const selectedCount =
    Object.values(selectedAssociates).filter(Boolean).length;

  // Count total associates
  const totalAssociatesCount =
    conflictData?.tests?.reduce(
      (total, test) => total + (test.conflictAssociates?.length || 0),
      0
    ) || 0;

  // Check if all associates are selected
  const allSelected =
    totalAssociatesCount > 0 && selectedCount === totalAssociatesCount;

  // Handle conflict resolution. The metadata now includes unified value information.
  const handleConflictResolution = () => {
    // Get the selected associates with their metadata
    const associatesToUpdate = Object.entries(selectedAssociates)
      .filter(([, metadata]) => metadata)
      .map(([, metadata]) => {
        // Ensure we have valid numeric values
        const unifiedPurchaseRate =
          typeof metadata.unifiedPurchaseRate === "number" &&
          !isNaN(metadata.unifiedPurchaseRate)
            ? metadata.unifiedPurchaseRate
            : 0;

        const unifiedSaleRate =
          typeof metadata.unifiedSaleRate === "number" &&
          !isNaN(metadata.unifiedSaleRate)
            ? metadata.unifiedSaleRate
            : 0;

        // Create a clean copy with explicit numeric values
        return {
          ...metadata,
          unifiedPurchaseRate,
          unifiedSaleRate,
          // Add clear purchaseRate and saleRate values to avoid ambiguity
          purchaseRate: unifiedPurchaseRate,
          saleRate: unifiedSaleRate,
        };
      });

    // If no associates selected, show a warning and prevent action
    if (associatesToUpdate.length === 0) {
      console.warn("No associates selected for conflict resolution");
      return;
    }

    console.log(
      "Submitting conflict resolution with values:",
      associatesToUpdate.map((a) => ({
        test: a.testName,
        purchaseRate: a.unifiedPurchaseRate,
        saleRate: a.unifiedSaleRate,
      }))
    );

    // Pass the selected items to the parent component
    setconflictedselected(associatesToUpdate);

    // Close the dialog
    onClose();
  };

  const getAssociateKey = (
    test: TestWithConflicts,
    associate: ConflictAssociate,
    index: number
  ): string => {
    const testId = test?.testId?._id || test?.testId?.name;
    return `${testId}-${associate.id || associate.firstName}-${
      associate.lastName || ""
    }-${index}`;
  };

  return (
    <div className="relative z-[200]">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        classNames={{
          backdrop: "z-[200]",
          wrapper: "z-[200]",
          base: "z-[200]",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Resolve Conflicts
              </ModalHeader>
              <ModalBody>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    The following items have conflicting price values. Select
                    which associates should receive the unified price value.
                  </p>
                  <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/60 sticky top-0">
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={(checked) =>
                                  toggleAllAssociates(!!checked)
                                }
                                id="select-all"
                              />
                              <label
                                htmlFor="select-all"
                                className="cursor-pointer"
                              >
                                Select All
                              </label>
                            </div>
                          </th>
                          <th className="py-3 px-4 text-left">Test</th>
                          <th className="py-3 px-4 text-right">
                            Unified Purchase Rate
                          </th>
                          <th className="py-3 px-4 text-right">
                            Unified Sale Rate
                          </th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflictData?.tests?.map((test, index) => {
                          const testId = `${
                            test.testId?.id || test.testId?.name
                          }-${index}`;
                          const isTestOpen = openTests[testId];

                          return (
                            <React.Fragment key={`${testId}-${index}`}>
                              {/* Main test row */}
                              <tr className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  {test.conflictAssociates?.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        checked={areAllTestAssociatesSelected(
                                          test
                                        )}
                                        onCheckedChange={(checked) =>
                                          toggleAllTestAssociates(
                                            test,
                                            !!checked
                                          )
                                        }
                                        id={`test-${testId}-${index}`}
                                      />
                                      <label
                                        htmlFor={`test-${testId}-${index}`}
                                        className="cursor-pointer"
                                      >
                                        Select All Associates
                                      </label>
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 font-medium">
                                  {test.testId?.name || "Unnamed Test"}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {(test.unifiedValue?.purchaseRate ||
                                    test.unifiedValue?.purchasePrice) &&
                                    `₹${Math.ceil(
                                      test.unifiedValue?.purchaseRate ||
                                        test.unifiedValue?.purchasePrice ||
                                        0
                                    )}`}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {test.unifiedValue?.saleRate &&
                                    `₹${Math.ceil(
                                      test.unifiedValue?.saleRate || 0
                                    )}`}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Button
                                    color="primary"
                                    variant="light"
                                    isIconOnly
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => toggleTestRow(testId)}
                                  >
                                    {isTestOpen ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </td>
                              </tr>

                              {/* Associate rows (expanded) */}
                              {isTestOpen &&
                                test.conflictAssociates?.map(
                                  (associate, associateIndex) => {
                                    const associateKey = getAssociateKey(
                                      test,
                                      associate,
                                      associateIndex
                                    );
                                    return (
                                      <tr
                                        key={associateKey}
                                        className="border-b bg-muted/20 hover:bg-muted/40"
                                      >
                                        <td className="py-2 px-4 pl-8">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              checked={
                                                !!selectedAssociates[
                                                  associateKey
                                                ]
                                              }
                                              onCheckedChange={(checked) =>
                                                toggleAssociateSelection(
                                                  associateKey,
                                                  test,
                                                  associate,
                                                  associateIndex
                                                )
                                              }
                                              id={`associate-${associateKey}`}
                                            />
                                            <label
                                              htmlFor={`associate-${associateKey}`}
                                              className="cursor-pointer"
                                            >
                                              {associate.fullName ||
                                                `${associate.firstName || ""} ${
                                                  associate.lastName || ""
                                                }`.trim() ||
                                                associate._id ||
                                                "Unnamed Associate"}
                                            </label>
                                          </div>
                                        </td>
                                        <td className="py-2 px-4"></td>
                                        <td className="py-2 px-4 text-right">
                                          {(associate.value?.purchaseRate ||
                                            associate.value?.purchasePrice) &&
                                            `₹${Math.ceil(
                                              associate.value?.purchaseRate ||
                                                associate.value
                                                  ?.purchasePrice ||
                                                0
                                            )}`}
                                        </td>
                                        <td className="py-2 px-4 text-right">
                                          {associate.value?.saleRate &&
                                            `₹${Math.ceil(
                                              associate.value?.saleRate || 0
                                            )}`}
                                        </td>
                                        <td></td>
                                      </tr>
                                    );
                                  }
                                )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleConflictResolution}
                  disabled={selectedCount === 0}
                >
                  Apply Selected ({selectedCount}/{totalAssociatesCount})
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

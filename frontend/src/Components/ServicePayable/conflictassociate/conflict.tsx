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

export default function AlertDialogbox({
  url,
  backdrop = "blur",
  isOpen,
  conflictData,
  onOpen,
  onClose: propOnClose,
}) {
  // Track which test rows are expanded
  const [openTests, setOpenTests] = useState({});

  // Instead of storing a boolean value, we now store metadata objects for selected associates.
  // When an associate is not selected, its key is absent.
  const [selectedAssociates, setSelectedAssociates] = useState({});

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
  const toggleTestRow = (uniqueTestKey) => {
    setOpenTests((prev) => ({
      ...prev,
      [uniqueTestKey]: !prev[uniqueTestKey],
    }));
  };

  // Toggle selection of a specific associate.
  // Now we also pass in the test, associate, and index so we can save extra metadata.
  const toggleAssociateSelection = (associateId, test, associate, index) => {
    setSelectedAssociates((prev) => {
      if (prev[associateId]) {
        // If already selected, remove it.
        const newSelections = { ...prev };
        delete newSelections[associateId];
        return newSelections;
      } else {
        // Otherwise, add a metadata object.
        return {
          ...prev,
          [associateId]: {
            testId: test?.testId?._id || test?.testId?.name,
            testName: test?.testId?.name || "Unnamed Test",
            associate,
            index,
          },
        };
      }
    });
  };

  // Toggle selection for all associates in a specific test.
  const toggleAllTestAssociates = (test, isSelected) => {
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
          };
        } else {
          delete updatedSelections[associateId];
        }
      });
      setSelectedAssociates(updatedSelections);
    }
  };

  // Toggle selection for all associates across all tests.
  const toggleAllAssociates = (isSelected) => {
    const newSelections = {};
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
            };
          }
        });
      }
    });
    setSelectedAssociates(newSelections);

    // Optionally expand all tests when selecting all
    if (isSelected) {
      const newOpenTests = {};
      conflictData?.tests?.forEach((test, index) => {
        const testId = `${test.testId?.id || test.testId?.name}-${index}`;
        newOpenTests[testId] = true;
      });
      setOpenTests(newOpenTests);
    }
  };

  // Check if all associates of a specific test are selected.
  const areAllTestAssociatesSelected = (test) => {
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
    conflictData?.tests.reduce(
      (total, test) => total + (test.conflictAssociates?.length || 0),
      0
    ) || 0;

  // Check if all associates are selected
  const allSelected =
    totalAssociatesCount > 0 && selectedCount === totalAssociatesCount;

  // Handle conflict resolution. Now we get the metadata for each selected associate.
  const handleConflictResolution = () => {
    const associatesToUpdate = Object.entries(selectedAssociates)
      .filter(([key, metadata]) => metadata)
      .map(([key, metadata]) => metadata);

    // Here you would add your API call to update the selected associates using the metadata.
    // For example:
    // axios.post(url, { associates: associatesToUpdate })
    //   .then(() => {
    //     queryClient.invalidateQueries(["yourQueryKey"]);
    //     onClose();
    //   });

    console.log("Updating associates with metadata:", associatesToUpdate);
    onClose();
  };

  const getAssociateKey = (test, associate, index) => {
    const testId = test?.testId?._id || test?.testId?.name;
    return `${testId}-${associate.id || associate.firstName}-${
      associate.lastName || ""
    }-${index}`;
  };

  return (
    <div className="relative z-[200]">
      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose} size="6xl">
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
                            Unified Value
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
                                  {test.unifiedValue?.price &&
                                    `$${test.unifiedValue.price}`}
                                </td>
                                <td className="py-3 px-4 text-center flex items-end justify-center">
                                  {test.conflictAssociates?.length > 0 ? (
                                    <Button
                                      variant="light"
                                      onClick={() => toggleTestRow(testId)}
                                      size="sm"
                                      className="flex items-center gap-1 align-right"
                                    >
                                      {isTestOpen ? (
                                        <>
                                          <span>Hide Associates</span>
                                          <ChevronUp className="h-4 w-4" />
                                        </>
                                      ) : (
                                        <>
                                          <span>
                                            View Associates (
                                            {test.conflictAssociates.length})
                                          </span>
                                          <ChevronDown className="h-4 w-4" />
                                        </>
                                      )}
                                    </Button>
                                  ) : (
                                    <span className="text-gray-500 text-sm">
                                      No conflicts
                                    </span>
                                  )}
                                </td>
                              </tr>

                              {isTestOpen &&
                                test.conflictAssociates?.map(
                                  (associate, idx) => {
                                    const associateId = getAssociateKey(
                                      test,
                                      associate,
                                      idx
                                    );

                                    return (
                                      <tr
                                        key={`${testId}-associate-${idx}`}
                                        className="border-b bg-blue-50 hover:bg-blue-100"
                                      >
                                        <td className="py-2 px-4 pl-8">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox
                                              checked={
                                                !!selectedAssociates[
                                                  associateId
                                                ]
                                              }
                                              onCheckedChange={() =>
                                                toggleAssociateSelection(
                                                  associateId,
                                                  test,
                                                  associate,
                                                  idx
                                                )
                                              }
                                              id={`associate-${associateId}`}
                                            />
                                            <label
                                              htmlFor={`associate-${associateId}`}
                                              className="cursor-pointer"
                                            >
                                              Select
                                            </label>
                                          </div>
                                        </td>
                                        <td className="py-2 px-4">
                                          <div className="flex flex-col">
                                            <span>
                                              {associate.firstName}{" "}
                                              {associate.lastName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              ID:{" "}
                                              {associate.id || "Not available"}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="py-2 px-4 text-right">
                                          <div className="flex flex-col">
                                            <div className="flex justify-end items-center gap-2">
                                              <span className="font-medium text-red-600">
                                                $
                                                {parseFloat(
                                                  associate.value?.price || 0
                                                ).toFixed(2)}
                                              </span>
                                              <span className="text-gray-400">
                                                →
                                              </span>
                                              <span className="font-medium text-green-600">
                                                $
                                                {parseFloat(
                                                  test.unifiedValue?.price || 0
                                                ).toFixed(2)}
                                              </span>
                                            </div>
                                            <span className="text-xs text-gray-500 text-right">
                                              {parseFloat(
                                                associate.value?.price || 0
                                              ) <
                                              parseFloat(
                                                test.unifiedValue?.price || 0
                                              )
                                                ? "Price will increase"
                                                : "Price will decrease"}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="py-2 px-4 text-center">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              toggleAssociateSelection(
                                                associateId,
                                                test,
                                                associate,
                                                idx
                                              )
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                          >
                                            {selectedAssociates[associateId]
                                              ? "Deselect"
                                              : "Select"}
                                          </Button>
                                        </td>
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
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {selectedCount} of {totalAssociatesCount} associates
                    selected
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleConflictResolution}
                  disabled={selectedCount === 0}
                >
                  Apply Changes to Selected
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

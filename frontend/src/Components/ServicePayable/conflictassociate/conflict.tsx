import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
// import { Button } from "@/components/ui/button";

export default function AlertDialogbox({
  url,
  backdrop = "blur",
  isOpen,
  conflictData,
  onOpen,
}) {
  const [conflictItems, setConflictItems] = useState<
    Array<{
      item: T;
      oldValue: number;
      newValue: number;
      selected: boolean;
      discountSource?: {
        type: "associate" | "department";
        value: number;
        isPercentage: boolean;
      };
    }>
  >([]);
  const onClose = () => {
    onOpen();
  };

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(conflictData);
  }, [conflictData]);

  const handleConflictResolution = () => {
    if (onBulkEdit) {
      // Get selected items from conflicts
      const selectedConflictItems = conflictItems
        .filter((conflict) => conflict.selected)
        .map((conflict) => conflict.item);

      // Get items without conflicts
      const nonConflictItems = selectedItems.filter(
        (item) =>
          !conflictItems.some((conflict) => conflict.item._id === item._id)
      );

      // Combine selected conflict items with non-conflict items
      const itemsToUpdate = [...selectedConflictItems, ...nonConflictItems];

      if (itemsToUpdate.length > 0) {
        onBulkEdit(bulkEditPercentage, itemsToUpdate);
      }

      setShowConflictModal(false);
      onSelectedItemsChange([]);
      setBulkEditPercentage(0);
    }
  };

  return (
    <>
      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Item
              </ModalHeader>
              <ModalBody>
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold">Resolve Conflicts</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowConflictModal(false);
                          setConflictItems([]);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-x"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-4">
                        The following items already have discounts applied.
                        Select which items should receive the new discount.
                      </p>
                      <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/60 sticky top-0">
                            <tr className="border-b">
                              <th className="py-3 px-4 text-left">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={conflictItems.every(
                                      (item) => item.selected
                                    )}
                                    onCheckedChange={(checked) =>
                                      toggleAllConflictItems(!!checked)
                                    }
                                  />
                                  <span>Select All</span>
                                </div>
                              </th>
                              <th className="py-3 px-4 text-left">Item</th>
                              <th className="py-3 px-4 text-right">
                                Current Price
                              </th>
                              <th className="py-3 px-4 text-right">
                                New Price
                              </th>
                              <th className="py-3 px-4 text-right">
                                Difference
                              </th>
                              <th className="py-3 px-4 text-center">
                                Current Discount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {console.log("Alert conflict", conflictData)}
                            {conflictData?.testId?.conflicts.map(
                              (conflict, index) => (
                                <tr
                                  key={index}
                                  className="border-b hover:bg-muted/50"
                                >
                                  <td className="py-3 px-4">
                                    <Checkbox
                                      checked={conflict.selected}
                                      onCheckedChange={() =>
                                        toggleConflictItem(index)
                                      }
                                    />
                                  </td>

                                  <td className="py-3 px-4">
                                    {conflict.item?.name ?? "Unnamed Item"}
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    {conflict.oldValue.toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    {conflict.newValue.toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4 text-right text-destructive">
                                    {(
                                      conflict.newValue - conflict.oldValue
                                    ).toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    {conflict.discountSource ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <span
                                          className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                  {conflict.discountSource.type === 'associate' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}"
                                        >
                                          {conflict.discountSource.type ===
                                          "associate"
                                            ? "Associate"
                                            : "Department"}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {conflict.discountSource.value}
                                          {conflict.discountSource.isPercentage
                                            ? "%"
                                            : " Rs"}
                                        </span>
                                      </div>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {conflictItems.filter((item) => item.selected).length}{" "}
                        of {conflictItems.length} items selected
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            onOpen(false);
                            setConflictItems([]);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleConflictResolution}
                          disabled={
                            !conflictItems.some((item) => item.selected)
                          }
                        >
                          Apply Selected Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">Confirm</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

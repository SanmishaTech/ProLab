import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, MoreHorizontal, Plus } from "lucide-react";
import AddEditModal from "./Add-editModal";
import Pagination from "./pagination";
import { motion, AnimatePresence } from "framer-motion";
import { Check, FilePenLine, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SortDirection = "asc" | "desc" | null;

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface Field<T> {
  key: keyof T;
  label: string;
  type: string;
}

//cancel
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  fields: Field<T>[];
  onAdd: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (items: T[]) => void;
  onBulkEdit?: (discountPercentage: number, items: T[]) => void;
  selectedItems: T[];
  onSelectedItemsChange: (items: T[]) => void;
  itemsPerPage?: number;
  setSelectedAssociate?: (associate: any) => void;
  conflictchecks?: {
    type: "associate" | "department";
    value: number;
    isPercentage: boolean;
    _id?: string | number;
  }[];
}

function DataTable<
  T extends {
    id: string | number;
    _id: string | number;
    purchaseRate?: number;
    saleRate?: number;
    name?: string;
    department?: string;
    associate?: string;
    originalPurchaseRate?: number;
    originalSaleRate?: number;
  }
>({
  data,
  columns,
  fields,
  onAdd,
  onEdit,
  onDelete,
  itemsPerPage = 10,
  onBulkEdit,
  selectedItems,
  onSelectedItemsChange,
  conflictchecks,
  setSelectedAssociate,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | undefined>(undefined);
  const [bulkEditPercentage, setBulkEditPercentage] = useState(0);
  const [purchaseRateValue, setPurchaseRateValue] = useState<number | null>(null);
  const [saleRateValue, setSaleRateValue] = useState<number | null>(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictItems, setConflictItems] = useState<
    Array<{
      item: T;
      oldPurchaseRate: number;
      oldSaleRate: number;
      newPurchaseRate: number;
      newSaleRate: number;
      selected: boolean;
      discountSource?: {
        type: "associate" | "department";
        value: number;
        isPercentage: boolean;
      };
    }>
  >([]);

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const paginatedData = sortedData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setEditingItem(undefined);
    setIsAddEditModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem({
      ...item,
      purchaseRate: typeof item.purchaseRate === 'number' ? item.purchaseRate : 0,
      saleRate: typeof item.saleRate === 'number' ? item.saleRate : 0,
    });
    setIsAddEditModalOpen(true);
  };

  const handleSave = (item: T) => {
    if (editingItem) {
      // Editing existing item
      // Ensure both rates are properly set as numbers and never NaN
      const updatedItem = {
        ...item,
        purchaseRate: typeof item.purchaseRate === 'number' && !isNaN(item.purchaseRate)
          ? Number(item.purchaseRate)
          : 0,
        saleRate: typeof item.saleRate === 'number' && !isNaN(item.saleRate)
          ? Number(item.saleRate)
          : 0,
      };
      console.log(`Saving edited item with purchase rate: ${updatedItem.purchaseRate}, sale rate: ${updatedItem.saleRate}`);
      onEdit(updatedItem);
    } else {
      // Adding new item
      // Ensure both rates are properly set as numbers and never NaN
      const newItem = {
        ...item,
        purchaseRate: typeof item.purchaseRate === 'number' && !isNaN(item.purchaseRate)
          ? Number(item.purchaseRate)
          : 0,
        saleRate: typeof item.saleRate === 'number' && !isNaN(item.saleRate)
          ? Number(item.saleRate)
          : 0,
      };
      console.log(`Adding new item with purchase rate: ${newItem.purchaseRate}, sale rate: ${newItem.saleRate}`);
      onAdd(newItem);
    }
    // Close the modal
    setIsAddEditModalOpen(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedItemsChange([...data]);
    } else {
      onSelectedItemsChange([]);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (checked) {
      onSelectedItemsChange([...selectedItems, item]);
    } else {
      onSelectedItemsChange(selectedItems.filter((i) => i._id !== item._id));
    }
  };

  const handleBulkEdit = () => {
    setShowBulkEditModal(true);
    // Reset values when opening the modal
    setPurchaseRateValue(null);
    setSaleRateValue(null);
    setBulkEditPercentage(0);
  };

  const handleBulkEditConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const discountPercentage = Number(bulkEditPercentage);
    const fixedPurchaseRate = purchaseRateValue !== null ? Number(purchaseRateValue) : null;
    const fixedSaleRate = saleRateValue !== null ? Number(saleRateValue) : null;

    // Validate that at least one adjustment method is specified
    if (
      (isNaN(discountPercentage) || discountPercentage <= 0) && 
      fixedPurchaseRate === null && 
      fixedSaleRate === null
    ) {
      // No valid adjustments
      console.warn("No valid price adjustments specified");
      return;
    }

    // Check for conflicts with bulk editing
    const conflicts = selectedItems
      .filter((item) => {
        // Check if there are conflicts with either purchase rate or sale rate
        return conflictchecks?.some(
          (conflict) => conflict._id === item._id
        );
      })
      .map((item) => {
        const discountSource = conflictchecks?.find(
          (conflict) => conflict._id === item._id
        );
        
        // Calculate new rates based on the adjustment method
        let newPurchaseRate = item?.purchaseRate ?? 0;
        let newSaleRate = item?.saleRate ?? 0;
        
        // Apply percentage discount if specified
        if (discountPercentage > 0) {
          newPurchaseRate = (item?.originalPurchaseRate ?? item?.purchaseRate ?? 0) * 
            (1 - discountPercentage / 100);
          newSaleRate = (item?.originalSaleRate ?? item?.saleRate ?? 0) * 
            (1 - discountPercentage / 100);
        }
        
        // Apply fixed rates if specified (these override percentage discount)
        if (fixedPurchaseRate !== null) {
          newPurchaseRate = fixedPurchaseRate;
        }
        
        if (fixedSaleRate !== null) {
          newSaleRate = fixedSaleRate;
        }
        
        // Ensure values are valid numbers
        newPurchaseRate = typeof newPurchaseRate !== 'number' || isNaN(newPurchaseRate) ? 0 : newPurchaseRate;
        newSaleRate = typeof newSaleRate !== 'number' || isNaN(newSaleRate) ? 0 : newSaleRate;
        
        return {
          item,
          oldPurchaseRate: item?.purchaseRate ?? 0,
          oldSaleRate: item?.saleRate ?? 0,
          newPurchaseRate,
          newSaleRate,
          selected: false,
          discountSource,
        };
      });

    if (conflicts.length > 0) {
      // Set conflict items first
      setConflictItems(conflicts);
      
      // Important: First close the bulk edit modal completely
      setShowBulkEditModal(false);
      
      // After a short delay, show the conflict modal to prevent UI glitches
      setTimeout(() => {
        setShowConflictModal(true);
      }, 300); // Increased delay to ensure the previous modal is fully closed
    } else {
      // No conflicts, proceed with bulk edit
      if (onBulkEdit) {
        const updatedItems = selectedItems.map(item => {
          const updatedItem = { ...item };
          
          // Apply percentage discount if specified
          if (discountPercentage > 0) {
            updatedItem.purchaseRate = (item?.originalPurchaseRate ?? item?.purchaseRate ?? 0) * 
              (1 - discountPercentage / 100);
            updatedItem.saleRate = (item?.originalSaleRate ?? item?.saleRate ?? 0) * 
              (1 - discountPercentage / 100);
          }
          
          // Apply fixed rates if specified (these override percentage discount)
          if (fixedPurchaseRate !== null) {
            updatedItem.purchaseRate = fixedPurchaseRate;
          }
          
          if (fixedSaleRate !== null) {
            updatedItem.saleRate = fixedSaleRate;
          }
          
          // Make sure we don't have NaN values
          if (typeof updatedItem.purchaseRate !== 'number' || isNaN(updatedItem.purchaseRate)) {
            updatedItem.purchaseRate = 0;
          }
          
          if (typeof updatedItem.saleRate !== 'number' || isNaN(updatedItem.saleRate)) {
            updatedItem.saleRate = 0;
          }
          
          return updatedItem;
        });
        
        onBulkEdit(discountPercentage, updatedItems);
      }
      setShowBulkEditModal(false);
    }
  };

  const handleConflictResolution = () => {
    // Filter only selected conflict items
    const selectedConflicts = conflictItems.filter((item) => item.selected);
    
    // Ensure we have selected items
    if (selectedConflicts.length === 0) {
      console.warn("No conflicts selected for resolution");
      return;
    }
    
    console.log("Selected conflicts to update:", selectedConflicts);
    
    // Extract the items that should receive the new prices
    const itemsToUpdate = selectedConflicts.map((conflict) => {
      // Ensure numeric values - never return NaN
      const newPurchaseRate = typeof conflict.newPurchaseRate === 'number' && !isNaN(conflict.newPurchaseRate) 
        ? conflict.newPurchaseRate 
        : conflict.oldPurchaseRate;
        
      const newSaleRate = typeof conflict.newSaleRate === 'number' && !isNaN(conflict.newSaleRate) 
        ? conflict.newSaleRate 
        : conflict.oldSaleRate;
      
      console.log(`Updating item ${conflict.item.name || conflict.item._id}: Purchase rate ${conflict.oldPurchaseRate} → ${newPurchaseRate}, Sale rate ${conflict.oldSaleRate} → ${newSaleRate}`);
      
      // Apply new purchase and sale rates to the items
      return {
        ...conflict.item,
        purchaseRate: newPurchaseRate,
        saleRate: newSaleRate,
        // Also update the original rates to match the new values
        originalPurchaseRate: newPurchaseRate,
        originalSaleRate: newSaleRate
      };
    });

    // First close the modal to prevent UI issues
    setShowConflictModal(false);
    
    // Apply the bulk edit only to selected conflicts
    if (onBulkEdit && itemsToUpdate.length > 0) {
      // Then apply updates
      onBulkEdit(0, itemsToUpdate); // We pass 0 for percentage since we're using the precalculated values directly
    }

    // Clean up
    setConflictItems([]);
    // Reset adjustment values
    setBulkEditPercentage(0);
    setPurchaseRateValue(null);
    setSaleRateValue(null);
  };

  const toggleConflictItem = (index: number) => {
    setConflictItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAllConflictItems = (selected: boolean) => {
    setConflictItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const handleRowClick = (item: T) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem._id === item._id
    );
    if (isSelected) {
      onSelectedItemsChange(selectedItems.filter((i) => i._id !== item._id));
    } else {
      onSelectedItemsChange([...selectedItems, item]);
    }
  };

  const renderCell = (item: T, column: Column<T>) => {
    const value = item[column.key];
    if (column.render) {
      return column.render(value, item);
    }

    // Special formatting for purchase and sale rates
    if (column.key === "purchaseRate" || column.key === "saleRate") {
      const hasConflict = conflictchecks?.some(
        (conflict) => conflict?._id === item._id
      );
      
      return (
        <div className="flex items-center">
          {typeof value === 'number' ? 
            (column.key === "purchaseRate" ? "₹" : "₹") + value.toFixed(2) :
            String(value)
          }
          {hasConflict && (
            <div className="ml-2 w-2 h-2 bg-red-500 rounded-full" title="Has conflicts"></div>
          )}
        </div>
      );
    }

    // Default rendering
    return String(value ?? "");
  };

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="w-[50px] font-medium">
                  <Checkbox
                    checked={
                      data?.length > 0 && selectedItems?.length === data?.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.key as string}
                    className="cursor-pointer hover:bg-muted/50 transition-colors font-medium"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {sortColumn === column.key &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableCell>
                ))}
                <TableCell className="w-[100px] font-medium">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData?.map((item) => (
                <TableRow
                  key={item._id as React.Key}
                  className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                    selectedItems.some((i) => i._id === item._id)
                      ? "bg-muted/30"
                      : ""
                  }`}
                  onClick={(e) => {
                    // Don't trigger row click when clicking on checkbox or action buttons
                    if (
                      (e.target as HTMLElement).closest(".checkbox-cell") ||
                      (e.target as HTMLElement).closest(".action-cell")
                    ) {
                      return;
                    }
                    handleRowClick(item);
                  }}
                >
                  <TableCell className="checkbox-cell">
                    <Checkbox
                      checked={selectedItems?.some((i) => i._id === item._id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item, checked as boolean)
                      }
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {renderCell(item, column)}
                    </TableCell>
                  ))}

                  <TableCell className="action-cell">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete([item])}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        {showBulkEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Bulk Edit Items</h3>
                <button
                  onClick={() => setShowBulkEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div>
                <form onSubmit={handleBulkEditConfirm}>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Adjustment Methods</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="discountPercentage"
                            className="text-sm font-medium"
                          >
                            Discount Percentage (%)
                          </label>
                          <div className="relative">
                            <input
                              id="discountPercentage"
                              type="number"
                              value={bulkEditPercentage}
                              onChange={(e) =>
                                setBulkEditPercentage(Number(e.target.value))
                              }
                              min="0"
                              max="100"
                              step="1"
                              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter discount percentage"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <span className="text-gray-500">%</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Apply a percentage discount to both purchase and sale rates
                          </p>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <h4 className="font-medium">Fixed Price Adjustment</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="purchaseRateAdjustment"
                                className="text-sm font-medium"
                              >
                                Purchase Rate
                              </label>
                              <div className="relative">
                                <input
                                  id="purchaseRateAdjustment"
                                  type="number"
                                  min="0"
                                  step="1"
                                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Set value"
                                  value={purchaseRateValue ?? ''}
                                  onChange={(e) => setPurchaseRateValue(e.target.value ? Number(e.target.value) : null)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-gray-500">₹</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="saleRateAdjustment"
                                className="text-sm font-medium"
                              >
                                Sale Rate
                              </label>
                              <div className="relative">
                                <input
                                  id="saleRateAdjustment"
                                  type="number"
                                  min="0"
                                  step="1" 
                                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Set value"
                                  value={saleRateValue ?? ''}
                                  onChange={(e) => setSaleRateValue(e.target.value ? Number(e.target.value) : null)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-gray-500">₹</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Set fixed values for purchase and sale rates
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-md mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-info"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>Selected Items: {selectedItems.length}</span>
                    </div>
                    {bulkEditPercentage > 0 && (
                      <div className="text-xs text-muted-foreground">
                        This will apply a {bulkEditPercentage}% discount to all
                        selected items
                      </div>
                    )}
                    {purchaseRateValue !== null && (
                      <div className="text-xs text-muted-foreground">
                        Purchase rate will be set to ₹{purchaseRateValue} for all selected items
                      </div>
                    )}
                    {saleRateValue !== null && (
                      <div className="text-xs text-muted-foreground">
                        Sale rate will be set to ₹{saleRateValue} for all selected items
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowBulkEditModal(false);
                        setBulkEditPercentage(0);
                        setPurchaseRateValue(null);
                        setSaleRateValue(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleBulkEditConfirm(e);
                      }}
                      disabled={
                        (bulkEditPercentage <= 0 || bulkEditPercentage > 100) &&
                        purchaseRateValue === null &&
                        saleRateValue === null
                      }
                    >
                      Apply Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <Dialog 
          open={showConflictModal} 
          onOpenChange={setShowConflictModal}
        >
          <DialogContent className="sm:max-w-[800px] z-[150]">
            <DialogHeader>
              <DialogTitle>Resolve Rate Conflicts</DialogTitle>
              <DialogDescription>
                Some items have pricing conflicts. How would you like to proceed?
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="w-[50px] font-medium">Apply</TableCell>
                    <TableCell className="font-medium">Item</TableCell>
                    <TableCell className="text-right font-medium">Current Purchase Rate</TableCell>
                    <TableCell className="text-right font-medium">New Purchase Rate</TableCell>
                    <TableCell className="text-right font-medium">Current Sale Rate</TableCell>
                    <TableCell className="text-right font-medium">New Sale Rate</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conflictItems.map((conflict, index) => (
                    <TableRow key={`conflict-${index}`}>
                      <TableCell>
                        <Checkbox
                          checked={conflict.selected}
                          onCheckedChange={(checked) =>
                            toggleConflictItem(index)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {conflict.item?.name ?? "Unnamed Item"}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{conflict.oldPurchaseRate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{conflict.newPurchaseRate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{conflict.oldSaleRate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{conflict.newSaleRate.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConflictModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConflictResolution}>Apply Selected</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AnimatePresence>
          {selectedItems && selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-4 left-[40%] transform -translate-x-1/2 bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white px-6 py-3 rounded-full shadow-xl flex items-center justify-between space-x-6 backdrop-blur- border border-white/10 z-50"
            >
              <motion.div
                className="flex items-center space-x-3"
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.02 }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Check className="text-white" size={18} strokeWidth={10} />
                </span>
                <span className="font-medium text-lg">
                  {selectedItems?.length} item
                  {selectedItems?.length !== 1 && "s"} selected
                </span>
              </motion.div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowBulkEditModal(true);
                  }}
                  className="hover:bg-white/20 hover:text-white text-white p-2.5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none"
                >
                  <FilePenLine className="text-white" size={20} />
                  <span className="sr-only">Edit selected</span>
                </Button>
                <div className="w-px h-6 bg-white/20"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onSelectedItemsChange([]);
                  }}
                  className="hover:bg-white/20 hover:text-white text-white p-2.5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none"
                >
                  <X className="text-white" size={20} />
                  <span className="sr-only">Clear selection</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Dialog 
          open={isAddEditModalOpen} 
          onOpenChange={(open) => !open && setIsAddEditModalOpen(false)}
        >
          <DialogContent className="sm:max-w-[425px] z-[150]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} Item</DialogTitle>
              <DialogDescription>
                {editingItem ? "Make changes to the item" : "Add a new item to the list"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave(editingItem as T);
            }}>
              <div className="grid gap-4 py-4">
                {fields.map((field) => (
                  <div key={field.key as string} className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field.key as string} className="text-right font-medium col-span-1">
                      {field.label}
                    </label>
                    <div className="col-span-3">
                      {(field.key === 'purchaseRate' || field.key === 'saleRate') ? (
                        <div className="relative">
                          <Input
                            id={field.key as string}
                            type="number"
                            min="0"
                            step="1"
                            value={editingItem ? (editingItem[field.key] as string) || "" : ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : 0;
                              setEditingItem(prev => ({ ...(prev as T), [field.key]: value }));
                            }}
                            className="w-full pl-8"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">₹</span>
                          </div>
                        </div>
                      ) : (
                        <Input
                          id={field.key as string}
                          type={field.type}
                          value={editingItem ? (editingItem[field.key] as string) || "" : ""}
                          onChange={(e) => {
                            const value = ["number", "tel"].includes(field.type) 
                              ? Number(e.target.value) 
                              : e.target.value;
                            setEditingItem(prev => ({ ...(prev as T), [field.key]: value }));
                          }}
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default DataTable;

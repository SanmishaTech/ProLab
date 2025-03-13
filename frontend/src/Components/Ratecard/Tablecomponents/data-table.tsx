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
import { Input } from "@heroui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import AddEditModal from "./Add-editModal";
import Pagination from "./pagination";
import { motion, AnimatePresence } from "framer-motion";
import { Check, FilePenLine, X } from "lucide-react";

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

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  fields: Field<T>[];
  onAdd: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (items: T[]) => void;
  // Updated onBulkEdit accepts a mode and corresponding value
  onBulkEdit?: (
    mode: "percentage" | "flat",
    value: number | { flatPurchasePrice: number; flatSaleRate: number },
    items: T[]
  ) => void;
  selectedItems: T[];
  onSelectedItemsChange: (items: T[]) => void;
  itemsPerPage?: number;
  conflictchecks?: {
    type: "associate" | "department";
    value: number;
    isPercentage: boolean;
  }[];
  // If you need to pass a callback to select a specific associate, include it as needed.
  setSelectedAssociate?: (associate: any) => void;
}

function DataTable<
  T extends {
    id: string | number;
    _id: string | number;
    // Updated to include dual pricing fields:
    purchasePrice?: number;
    saleRate?: number;
    defaultPurchasePrice?: number;
    defaultSaleRate?: number;
    name?: string;
    department?: string;
    associate?: string;
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
  // Bulk edit state
  const [bulkEditMode, setBulkEditMode] = useState<"percentage" | "flat">(
    "percentage"
  );
  const [bulkEditPercentage, setBulkEditPercentage] = useState(0);
  const [flatPurchasePrice, setFlatPurchasePrice] = useState(0);
  const [flatSaleRate, setFlatSaleRate] = useState(0);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictItems, setConflictItems] = useState<
    Array<{
      item: T;
      oldValue: { purchasePrice: number; saleRate: number };
      newValue: { purchasePrice: number; saleRate: number };
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
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const handleSave = (item: T) => {
    if (editingItem) {
      onEdit(item);
    } else {
      onAdd(item);
    }
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

  // Updated bulk-edit confirm handler that applies either percentage discount or flat rates
  const handleBulkEditConfirm = (e: any) => {
    e.preventDefault();
    if (onBulkEdit) {
      const conflicts = selectedItems
        .map((item) => {
          let newPurchasePrice: number, newSaleRate: number;
          if (bulkEditMode === "percentage") {
            newPurchasePrice =
              (item?.defaultPurchasePrice ?? 0) *
              (1 - bulkEditPercentage / 100);
            newSaleRate =
              (item?.defaultSaleRate ?? 0) * (1 - bulkEditPercentage / 100);
          } else {
            newPurchasePrice = flatPurchasePrice;
            newSaleRate = flatSaleRate;
          }
          const discountSource = conflictchecks?.find(
            (check) =>
              (check.type === "associate" && item.associate) ||
              (check.type === "department" && item.department)
          );
          return {
            item,
            oldValue: {
              purchasePrice: item?.purchasePrice ? item?.purchasePrice : 0,
              saleRate: item?.saleRate ? item?.saleRate : 0,
            },
            newValue: {
              purchasePrice: newPurchasePrice,
              saleRate: newSaleRate,
            },
            selected: false,
            discountSource,
          };
        })
        .filter(
          (conflict) =>
            conflict.item?.purchasePrice !==
              conflict.item?.defaultPurchasePrice ||
            conflict.item?.saleRate !== conflict.item?.defaultSaleRate
        );

      if (conflicts.length > 0) {
        setConflictItems(conflicts);
        setShowConflictModal(true);
        setShowBulkEditModal(false);
      } else {
        onBulkEdit(
          bulkEditMode,
          bulkEditMode === "percentage"
            ? bulkEditPercentage
            : { flatPurchasePrice, flatSaleRate },
          selectedItems
        );
        onSelectedItemsChange([]);
        setBulkEditPercentage(0);
        setFlatPurchasePrice(0);
        setFlatSaleRate(0);
        setShowBulkEditModal(false);
      }
    }
  };

  const handleConflictResolution = () => {
    if (onBulkEdit) {
      // Get the items that were approved in the conflict modal…
      const selectedConflictItems = conflictItems
        .filter((conflict) => conflict.selected)
        .map((conflict) => conflict.item);

      // And also include the items that had no conflicts.
      const nonConflictItems = selectedItems.filter(
        (item) =>
          !conflictItems.some((conflict) => conflict.item._id === item._id)
      );

      const itemsToUpdate = [...selectedConflictItems, ...nonConflictItems];

      if (itemsToUpdate.length > 0) {
        onBulkEdit(
          bulkEditMode,
          bulkEditMode === "percentage"
            ? bulkEditPercentage
            : { flatPurchasePrice, flatSaleRate },
          itemsToUpdate
        );
      }
      // Reset conflict modal and inputs.
      setShowConflictModal(false);
      onSelectedItemsChange([]);
      setBulkEditPercentage(0);
      setFlatPurchasePrice(0);
      setFlatSaleRate(0);
    }
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

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      data?.length > 0 && selectedItems?.length === data?.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={column.key as string}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
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
                  </TableHead>
                ))}
                <TableHead className="w-[100px]">Actions</TableHead>
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
                      {["purchasePrice", "saleRate"].includes(
                        column.key as string
                      )
                        ? column.render
                          ? column.render(
                              Math.ceil(Number(item[column.key])),
                              item
                            )
                          : Math.ceil(Number(item[column.key]))
                        : column.render
                        ? column.render(item[column.key], item)
                        : (item[column.key] as React.ReactNode)}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Apply Compensation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBulkEditModal(false)}
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
              {/* Toggle between Percentage and Flat Rate */}
              <div className="flex space-x-4 mb-4">
                <Button
                  variant={
                    bulkEditMode === "percentage" ? "default" : "outline"
                  }
                  onClick={() => setBulkEditMode("percentage")}
                >
                  Percentage
                </Button>
                <Button
                  variant={bulkEditMode === "flat" ? "default" : "outline"}
                  onClick={() => setBulkEditMode("flat")}
                >
                  Flat Rate
                </Button>
              </div>
              <div className="space-y-4">
                {bulkEditMode === "percentage" ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Compensation Percentage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bulkEditPercentage}
                          onChange={(e) =>
                            setBulkEditPercentage(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                          placeholder="Enter percentage"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                    {bulkEditPercentage > 0 && (
                      <div className="text-xs text-muted-foreground">
                        This will apply a {bulkEditPercentage}% discount to all
                        selected items (both purchase price and sale rate)
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        New Purchase Price
                      </label>
                      <input
                        type="number"
                        value={flatPurchasePrice}
                        onChange={(e) =>
                          setFlatPurchasePrice(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Enter flat purchase price"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        New Sale Rate
                      </label>
                      <input
                        type="number"
                        value={flatSaleRate}
                        onChange={(e) =>
                          setFlatSaleRate(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Enter flat sale rate"
                      />
                    </div>
                    {(flatPurchasePrice > 0 || flatSaleRate > 0) && (
                      <div className="text-xs text-muted-foreground">
                        This will update purchase price to {flatPurchasePrice}{" "}
                        and sale rate to {flatSaleRate} for all selected items.
                      </div>
                    )}
                  </>
                )}
                <div className="bg-muted/30 p-3 rounded-md">
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
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBulkEditModal(false);
                      setBulkEditPercentage(0);
                      setFlatPurchasePrice(0);
                      setFlatSaleRate(0);
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
                      bulkEditMode === "percentage"
                        ? bulkEditPercentage <= 0 || bulkEditPercentage > 100
                        : flatPurchasePrice <= 0 || flatSaleRate <= 0
                    }
                  >
                    Apply{" "}
                    {bulkEditMode === "percentage" ? "Discount" : "Update"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showConflictModal && (
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
                  The following items already have discounts applied. Select
                  which items should receive the new update.
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
                          Current Purchase Price
                        </th>
                        <th className="py-3 px-4 text-right">
                          New Purchase Price
                        </th>
                        <th className="py-3 px-4 text-right">
                          Diff (Purchase)
                        </th>
                        <th className="py-3 px-4 text-right">
                          Current Sale Rate
                        </th>
                        <th className="py-3 px-4 text-right">New Sale Rate</th>
                        <th className="py-3 px-4 text-right">Diff (Sale)</th>
                        <th className="py-3 px-4 text-center">
                          Current Discount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {conflictItems.map((conflict, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Checkbox
                              checked={conflict.selected}
                              onCheckedChange={() => toggleConflictItem(index)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            {conflict.item?.name ?? "Unnamed Item"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {Math.ceil(conflict.oldValue.purchasePrice || 0)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {Math.ceil(conflict.newValue.purchasePrice || 0)}
                          </td>
                          <td className="py-3 px-4 text-right text-destructive">
                            {Math.ceil(
                              conflict.newValue.purchasePrice -
                                conflict.oldValue.purchasePrice
                            ) || 0}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {Math.ceil(conflict.oldValue.saleRate || 0)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {Math.ceil(conflict.newValue.saleRate || 0) || 0}
                          </td>
                          <td className="py-3 px-4 text-right text-destructive">
                            {Math.ceil(
                              conflict.newValue.saleRate -
                                conflict.oldValue.saleRate
                            ) || 0}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {conflict.discountSource ? (
                              <div className="flex flex-col items-center gap-1">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                    conflict.discountSource.type === "associate"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {conflict.discountSource.type === "associate"
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {conflictItems.filter((item) => item.selected).length} of{" "}
                  {conflictItems.length} items selected
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowConflictModal(false);
                      setConflictItems([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConflictResolution}
                    disabled={!conflictItems.some((item) => item.selected)}
                  >
                    Apply Selected Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <AnimatePresence>
          {selectedItems && selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-4 left-[40%] transform -translate-x-1/2 bg-gradient-to-r from-[#2563EB] to-[#2563EB] text-white px-6 py-3 rounded-full shadow-xl flex items-center justify-between space-x-6 backdrop-blur- border border-white/10"
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
        <AddEditModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          onSave={handleSave}
          item={editingItem}
          fields={fields}
        />
      </div>
    </>
  );
}

export default DataTable;

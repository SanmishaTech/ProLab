import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  History,
  Clock,
  ClipboardList,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a history entry interface
interface PriceHistoryEntry {
  date: string;
  purchasePrice: number;
  saleRate: number;
  associate?: string;
  department?: string;
  reason?: string;
  purchasePrice?: number;
  percentage?: number;
  fromDate?: string;
  toDate?: string | null;
  _id?: string;
}

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
}

// Pure function to sort data
const sortData = <T extends Record<string, any>>(
  data: T[],
  sortColumn: keyof T | null,
  sortDirection: SortDirection
): T[] => {
  if (!sortColumn || !sortDirection) return data;

  return [...data].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

// Pure function to paginate data
const paginateData = <T extends Record<string, any>>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  return data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
};

// Pure function to generate mock history data
const generateMockHistory = <
  T extends {
    originalPurchaseRate?: number;
    originalSaleRate?: number;
    purchasePrice?: number;
    saleRate?: number;
    associate?: string;
    department?: string;
  }
>(
  item: T
): PriceHistoryEntry[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const originalPurchaseRate = item.originalPurchaseRate || 0;
  const originalSaleRate = item.originalSaleRate || 0;
  const currentPurchaseRate = item.purchasePrice || 0;
  const saleRate = item.saleRate || 0;

  return [
    {
      date: today.toLocaleDateString("en-GB"),
      purchasePrice: currentPurchaseRate,
      saleRate: saleRate,
      associate: item.associate,
      department: item.department,
      reason: "Current Price",
    },
    {
      date: yesterday.toLocaleDateString("en-GB"),
      purchasePrice: Math.round(currentPurchaseRate * 1.05),
      saleRate: Math.round(saleRate * 1.05),
      associate: item.associate,
      department: item.department,
      reason: "Associate Discount Applied",
    },
    {
      date: lastWeek.toLocaleDateString("en-GB"),
      purchasePrice: originalPurchaseRate,
      saleRate: originalSaleRate,
      associate: item.associate,
      department: item.department,
      reason: "Original Price",
    },
  ];
};

// Pure function to format a cell value
const formatCellValue = <T extends Record<string, any>>(
  value: T[keyof T],
  column: keyof T
): string => {
  if (column === "purchasePrice" || column === "saleRate") {
    const numericValue = typeof value === "number" && !isNaN(value) ? value : 0;
    return `₹${numericValue.toFixed(2)}`;
  }

  return String(value ?? "");
};

// Helper function to format values for display
const formatValue = (value: any): React.ReactNode => {
  if (value === undefined || value === null) {
    return "-";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? value : Number(value).toFixed(2);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value;
};

function DataTable<
  T extends {
    id: string | number;
    _id: string | number;
    purchasePrice?: number;
    saleRate?: number;
    name?: string;
    department?: string;
    associate?: string;
    originalPurchaseRate?: number;
    originalSaleRate?: number;
    history?: PriceHistoryEntry[];
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
  setSelectedAssociate,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | undefined>(undefined);
  const [bulkEditPercentage, setBulkEditPercentage] = useState(0);
  const [purchaseRateValue, setPurchaseRateValue] = useState<number | null>(
    null
  );
  const [saleRateValue, setSaleRateValue] = useState<number | null>(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyItems, setHistoryItems] = useState<T[]>([]);
  const [activeHistoryTab, setActiveHistoryTab] = useState<string>("all");

  // Memoize sorted data
  const sortedData = useMemo(
    () => sortData(data, sortColumn, sortDirection),
    [data, sortColumn, sortDirection]
  );

  // Memoize paginated data
  const paginatedData = useMemo(
    () => paginateData(sortedData, currentPage, itemsPerPage),
    [sortedData, currentPage, itemsPerPage]
  );

  // Memoize total pages
  const totalPages = useMemo(
    () => Math.ceil(sortedData.length / itemsPerPage),
    [sortedData.length, itemsPerPage]
  );

  const handleSort = useCallback((column: keyof T) => {
    setSortColumn((prevColumn) => {
      if (prevColumn === column) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        return column;
      } else {
        setSortDirection("asc");
        return column;
      }
    });
  }, []);

  const handleShowHistory = useCallback((items: T[]) => {
    setHistoryItems(items);
    setShowHistoryModal(true);
    setActiveHistoryTab("all");
  }, []);

  const handleAdd = useCallback(() => {
    setEditingItem(undefined);
    setIsAddEditModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setEditingItem({
      ...item,
      purchasePrice:
        typeof item.purchasePrice === "number" ? item.purchasePrice : 0,
      saleRate: typeof item.saleRate === "number" ? item.saleRate : 0,
    });
    setIsAddEditModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (item: T) => {
      if (editingItem) {
        // Editing existing item
        // Ensure both rates are properly set as numbers and never NaN
        const updatedItem = {
          ...item,
          purchasePrice:
            typeof item.purchasePrice === "number" && !isNaN(item.purchasePrice)
              ? Number(item.purchasePrice)
              : 0,
          saleRate:
            typeof item.saleRate === "number" && !isNaN(item.saleRate)
              ? Number(item.saleRate)
              : 0,
        };
        onEdit(updatedItem);
      } else {
        // Adding new item
        // Ensure both rates are properly set as numbers and never NaN
        const newItem = {
          ...item,
          purchasePrice:
            typeof item.purchasePrice === "number" && !isNaN(item.purchasePrice)
              ? Number(item.purchasePrice)
              : 0,
          saleRate:
            typeof item.saleRate === "number" && !isNaN(item.saleRate)
              ? Number(item.saleRate)
              : 0,
        };
        onAdd(newItem);
      }
      // Close the modal
      safelyCloseModal(setIsAddEditModalOpen);
    },
    [editingItem, onAdd, onEdit]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      onSelectedItemsChange(checked ? [...data] : []);
    },
    [data, onSelectedItemsChange]
  );

  const handleSelectItem = useCallback(
    (item: T, checked: boolean) => {
      onSelectedItemsChange(
        checked
          ? [...selectedItems, item]
          : selectedItems.filter((i) => i._id !== item._id)
      );
    },
    [selectedItems, onSelectedItemsChange]
  );

  const handleRowClick = useCallback(
    (item: T) => {
      const isSelected = selectedItems.some(
        (selectedItem) => selectedItem._id === item._id
      );
      onSelectedItemsChange(
        isSelected
          ? selectedItems.filter((i) => i._id !== item._id)
          : [...selectedItems, item]
      );
    },
    [selectedItems, onSelectedItemsChange]
  );

  const handleBulkEdit = useCallback(() => {
    setShowBulkEditModal(true);
    // Reset values when opening the modal
    setPurchaseRateValue(null);
    setSaleRateValue(null);
    setBulkEditPercentage(0);
  }, []);

  const handleBulkEditConfirm = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const discountPercentage = Number(bulkEditPercentage);
      const fixedPurchaseRate =
        purchaseRateValue !== null ? Number(purchaseRateValue) : null;
      const fixedSaleRate =
        saleRateValue !== null ? Number(saleRateValue) : null;

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

      // Process bulk edit
      if (onBulkEdit) {
        const updatedItems = selectedItems.map((item) => {
          // Create a copy of the item
          const updatedItem = { ...item };

          // Get original rates with fallbacks
          const originalPurchaseRate =
            typeof item?.originalPurchaseRate === "number" &&
            !isNaN(item.originalPurchaseRate)
              ? item.originalPurchaseRate
              : typeof item?.purchasePrice === "number" &&
                !isNaN(item.purchasePrice)
              ? item.purchasePrice
              : 0;

          const originalSaleRate =
            typeof item?.originalSaleRate === "number" &&
            !isNaN(item.originalSaleRate)
              ? item.originalSaleRate
              : typeof item?.saleRate === "number" && !isNaN(item.saleRate)
              ? item.saleRate
              : 0;

          // Apply percentage discount if specified
          if (discountPercentage > 0) {
            updatedItem.purchasePrice =
              originalPurchaseRate * (1 - discountPercentage / 100);
            updatedItem.saleRate =
              originalSaleRate * (1 - discountPercentage / 100);
          }

          // Apply fixed rates if specified (these override percentage discount)
          if (fixedPurchaseRate !== null) {
            updatedItem.purchasePrice = fixedPurchaseRate;
          }

          if (fixedSaleRate !== null) {
            updatedItem.saleRate = fixedSaleRate;
          }

          // Final validation to ensure no NaN values
          if (
            typeof updatedItem.purchasePrice !== "number" ||
            isNaN(updatedItem.purchasePrice)
          ) {
            updatedItem.purchasePrice = 0;
          }

          if (
            typeof updatedItem.saleRate !== "number" ||
            isNaN(updatedItem.saleRate)
          ) {
            updatedItem.saleRate = 0;
          }

          return updatedItem;
        });

        onBulkEdit(discountPercentage, updatedItems);
      }
      safelyCloseModal(setShowBulkEditModal);
    },
    [
      bulkEditPercentage,
      purchaseRateValue,
      saleRateValue,
      selectedItems,
      onBulkEdit,
    ]
  );

  // Function to safely close modals and reset document state
  const safelyCloseModal = useCallback(
    (
      modalSetter: React.Dispatch<React.SetStateAction<boolean>>,
      resetAction?: () => void
    ) => {
      // First close the modal
      modalSetter(false);

      // Reset document state immediately
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px"; // Remove potential padding added by modal libraries

      // Run any additional reset actions with a small delay
      if (resetAction) {
        setTimeout(resetAction, 100);
      }
    },
    []
  );

  const renderCell = useCallback((item: T, column: Column<T>) => {
    const value = item[column.key];
    if (column.render) {
      return column.render(value, item);
    }

    // Special formatting for purchase and sale rates
    if (column.key === "purchasePrice" || column.key === "saleRate") {
      // Ensure the value is a valid number, not NaN
      const numericValue =
        typeof value === "number" && !isNaN(value) ? (value as number) : 0;

      return (
        <div className="flex items-center">
          {typeof value === "number"
            ? `${
                column.key === "purchasePrice" ? "₹" : "₹"
              }${numericValue.toFixed(2)}`
            : String(value || "0.00")}
        </div>
      );
    }

    // Default rendering
    return String(value ?? "");
  }, []);

  // Effect to reset document state when modals close
  useEffect(() => {
    // Reset document state when all modals are closed
    if (!showHistoryModal && !showBulkEditModal && !isAddEditModalOpen) {
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      // Cleanup function to ensure body styles are reset when component unmounts
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [showHistoryModal, showBulkEditModal, isAddEditModalOpen]);

  // Pure function to render history content
  const renderHistoryContent = () => {
    // Group history by test
    console.log("History p1", historyItems);
    const testGroups = historyItems.map((item) => ({
      test: item,
      history: item.history || generateMockHistory(item),
    }));

    // Sort history entries by date (newest first)
    testGroups.forEach((group) => {
      group.history.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = a.fromDate
          ? new Date(a.fromDate).getTime()
          : a.date
          ? new Date(a.date.split("/").reverse().join("-")).getTime()
          : 0;
        const dateB = b.fromDate
          ? new Date(b.fromDate).getTime()
          : b.date
          ? new Date(b.date.split("/").reverse().join("-")).getTime()
          : 0;
        return dateB - dateA;
      });
    });

    // Get unique associates and departments for filtering
    console.log("History items", testGroups);
    const associates = Array.from(
      new Set(historyItems.filter((item) => item.associate).map((item) => item))
    );

    const departments = Array.from(
      new Set(
        historyItems.filter((item) => item.department).map((item) => item)
      )
    );
    console.log("Departments", associates);

    return (
      <div className="w-full">
        <Tabs
          defaultValue="all"
          value={activeHistoryTab}
          onValueChange={setActiveHistoryTab}
        >
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">
              All Tests ({testGroups.length})
            </TabsTrigger>
            {associates.map((associate) => (
              <TabsTrigger key={associate} value={associate || "unknown"}>
                {associate} (
                {
                  testGroups.filter((g) => g.test.associate === associate)
                    .length
                }
                )
              </TabsTrigger>
            ))}
            {/* {departments.map((department) => (
              <TabsTrigger
                key={`dept-${department.name}`}
                value={`dept-${department.name}`}
              >
                {department.name} (
                {
                  testGroups.filter((g) => g.test?._id === department?._id)
                    .length
                }
                )
              </TabsTrigger>
            ))} */}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <ScrollArea className="h-[500px] pr-4">
              {testGroups.length === 0 || testGroups.length < 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mb-4" />
                  <p>No history data available</p>
                </div>
              ) : (
                testGroups.map((group, groupIndex) => (
                  <div
                    key={`group-${groupIndex}`}
                    className="mb-6 bg-muted/20 p-4 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold">
                        {group.test.name || `Test #${group.test._id}`}
                      </h3>
                      <div className="flex items-center gap-2">
                        {group.test.department && (
                          <Badge variant="secondary">
                            {group.test.department}
                          </Badge>
                        )}
                        {group.test.associate && (
                          <Badge variant="outline">
                            {group.test.associate}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-2 text-sm flex flex-wrap gap-4 text-muted-foreground">
                      <span>
                        Original Purchase Rate: ₹
                        {(group.test.originalPurchaseRate || 0).toFixed(2)}
                      </span>
                      <span>
                        Original Sale Rate: ₹
                        {(group.test.originalSaleRate || 0).toFixed(2)}
                      </span>
                      <span>
                        Current Purchase Rate: ₹
                        {(group.test.purchasePrice || 0).toFixed(2)}
                      </span>
                      <span>
                        Current Sale Rate: ₹
                        {(group.test.saleRate || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableCell className="font-medium">Date</TableCell>
                            <TableCell className="font-medium text-right">
                              Purchase Rate
                            </TableCell>
                            <TableCell className="font-medium text-right">
                              Sale Rate
                            </TableCell>
                            <TableCell className="font-medium">
                              Change
                            </TableCell>
                            <TableCell className="font-medium">
                              Reason
                            </TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.history.map((entry, entryIndex) => {
                            // Calculate previous entry for comparison
                            const prevEntry = group.history[entryIndex + 1];
                            const purchaseRateDiff = prevEntry
                              ? (entry.purchasePrice ||
                                  entry.purchasePrice ||
                                  0) -
                                (prevEntry.purchasePrice ||
                                  prevEntry.purchasePrice ||
                                  0)
                              : 0;
                            const saleRateDiff = prevEntry
                              ? (entry.saleRate || 0) -
                                (prevEntry.saleRate || 0)
                              : 0;

                            // Determine if this was an increase or decrease
                            const purchaseDirection =
                              purchaseRateDiff > 0
                                ? "text-green-500"
                                : purchaseRateDiff < 0
                                ? "text-red-500"
                                : "text-muted-foreground";

                            const saleDirection =
                              saleRateDiff > 0
                                ? "text-green-500"
                                : saleRateDiff < 0
                                ? "text-red-500"
                                : "text-muted-foreground";

                            // Format the date for display
                            const displayDate =
                              entry.date ||
                              (entry.fromDate
                                ? new Date(entry.fromDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "Unknown");

                            const displayPurchaseRate =
                              entry.purchasePrice || entry.purchasePrice || 0;

                            return (
                              <TableRow key={`entry-${entryIndex}`}>
                                <TableCell className="whitespace-nowrap">
                                  {displayDate}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹{displayPurchaseRate.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹{(entry.saleRate || 0).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  {prevEntry && (
                                    <div className="flex flex-col text-xs">
                                      <span className={purchaseDirection}>
                                        Purchase:{" "}
                                        {purchaseRateDiff > 0 ? "+" : ""}
                                        {purchaseRateDiff.toFixed(2)}
                                        {purchaseRateDiff !== 0 && (
                                          <span className="ml-1">
                                            (
                                            {Math.abs(
                                              (purchaseRateDiff /
                                                (prevEntry.purchasePrice ||
                                                  prevEntry.purchasePrice ||
                                                  1)) *
                                                100
                                            ).toFixed(1)}
                                            %)
                                          </span>
                                        )}
                                      </span>
                                      <span className={saleDirection}>
                                        Sale: {saleRateDiff > 0 ? "+" : ""}
                                        {saleRateDiff.toFixed(2)}
                                        {saleRateDiff !== 0 && (
                                          <span className="ml-1">
                                            (
                                            {Math.abs(
                                              (saleRateDiff /
                                                (prevEntry.saleRate || 1)) *
                                                100
                                            ).toFixed(1)}
                                            %)
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="font-normal"
                                  >
                                    {entry.reason || "Rate Change"}
                                  </Badge>
                                  {entry.percentage && entry.percentage > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 font-normal"
                                    >
                                      {entry.percentage}% discount
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
          {console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", associates)}
          {associates.map((associate) => (
            <TabsContent
              key={associate}
              value={associate || "unknown"}
              className="space-y-6"
            >
              <ScrollArea className="h-[500px] pr-4">
                {testGroups
                  .filter((group) => group.test.associate === associate)
                  .map((group, groupIndex) => (
                    <div
                      key={`group-${groupIndex}`}
                      className="mb-6 bg-muted/20 p-4 rounded-md"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">
                          {group.test.name || `Test #${group.test._id}`}
                        </h3>
                        {group.test.department && (
                          <Badge variant="secondary">
                            {group.test.department}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-2 text-sm flex flex-wrap gap-4 text-muted-foreground">
                        <span>
                          Original Purchase Rate: ₹
                          {(group.test.originalPurchaseRate || 0).toFixed(2)}
                        </span>
                        <span>
                          Original Sale Rate: ₹
                          {(group.test.originalSaleRate || 0).toFixed(2)}
                        </span>
                        <span>
                          Current Purchase Rate: ₹
                          {(group.test.purchasePrice || 0).toFixed(2)}
                        </span>
                        <span>
                          Current Sale Rate: ₹
                          {(group.test.saleRate || 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableCell className="font-medium">
                                Date
                              </TableCell>
                              <TableCell className="font-medium text-right">
                                Purchase Rate
                              </TableCell>
                              <TableCell className="font-medium text-right">
                                Sale Rate
                              </TableCell>
                              <TableCell className="font-medium">
                                Change
                              </TableCell>
                              <TableCell className="font-medium">
                                Reason
                              </TableCell>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.history.map((entry, entryIndex) => {
                              // Calculate previous entry for comparison
                              const prevEntry = group.history[entryIndex + 1];
                              const purchaseRateDiff = prevEntry
                                ? (entry.purchasePrice ||
                                    entry.purchasePrice ||
                                    0) -
                                  (prevEntry.purchasePrice ||
                                    prevEntry.purchasePrice ||
                                    0)
                                : 0;
                              const saleRateDiff = prevEntry
                                ? (entry.saleRate || 0) -
                                  (prevEntry.saleRate || 0)
                                : 0;

                              // Determine if this was an increase or decrease
                              const purchaseDirection =
                                purchaseRateDiff > 0
                                  ? "text-green-500"
                                  : purchaseRateDiff < 0
                                  ? "text-red-500"
                                  : "text-muted-foreground";

                              const saleDirection =
                                saleRateDiff > 0
                                  ? "text-green-500"
                                  : saleRateDiff < 0
                                  ? "text-red-500"
                                  : "text-muted-foreground";

                              // Format the date for display
                              const displayDate =
                                entry.date ||
                                (entry.fromDate
                                  ? new Date(entry.fromDate).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }
                                    )
                                  : "Unknown");

                              const displayPurchaseRate =
                                entry.purchasePrice || entry.purchasePrice || 0;

                              return (
                                <TableRow key={`entry-${entryIndex}`}>
                                  <TableCell className="whitespace-nowrap">
                                    {displayDate}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ₹{displayPurchaseRate.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ₹{(entry.saleRate || 0).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {prevEntry && (
                                      <div className="flex flex-col text-xs">
                                        <span className={purchaseDirection}>
                                          Purchase:{" "}
                                          {purchaseRateDiff > 0 ? "+" : ""}
                                          {purchaseRateDiff.toFixed(2)}
                                          {purchaseRateDiff !== 0 && (
                                            <span className="ml-1">
                                              (
                                              {Math.abs(
                                                (purchaseRateDiff /
                                                  (prevEntry.purchasePrice ||
                                                    prevEntry.purchasePrice ||
                                                    1)) *
                                                  100
                                              ).toFixed(1)}
                                              %)
                                            </span>
                                          )}
                                        </span>
                                        <span className={saleDirection}>
                                          Sale: {saleRateDiff > 0 ? "+" : ""}
                                          {saleRateDiff.toFixed(2)}
                                          {saleRateDiff !== 0 && (
                                            <span className="ml-1">
                                              (
                                              {Math.abs(
                                                (saleRateDiff /
                                                  (prevEntry.saleRate || 1)) *
                                                  100
                                              ).toFixed(1)}
                                              %)
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="font-normal"
                                    >
                                      {entry.reason || "Rate Change"}
                                    </Badge>
                                    {entry.percentage &&
                                      entry.percentage > 0 && (
                                        <Badge
                                          variant="secondary"
                                          className="ml-2 font-normal"
                                        >
                                          {entry.percentage}% discount
                                        </Badge>
                                      )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
          ))}

          {/* Department Tabs */}
          {departments.map((department) => (
            <TabsContent
              key={`dept-${department}`}
              value={`dept-${department}`}
              className="space-y-6"
            >
              <ScrollArea className="h-[500px] pr-4">
                {testGroups
                  .filter((group) => group.test.department === department)
                  .map((group, groupIndex) => (
                    <div
                      key={`group-${groupIndex}`}
                      className="mb-6 bg-muted/20 p-4 rounded-md"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">
                          {group.test.name || `Test #${group.test._id}`}
                        </h3>
                        {group.test.associate && (
                          <Badge variant="outline">
                            {group.test.associate}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-2 text-sm flex flex-wrap gap-4 text-muted-foreground">
                        <span>
                          Original Purchase Rate: ₹
                          {(group.test.originalPurchaseRate || 0).toFixed(2)}
                        </span>
                        <span>
                          Original Sale Rate: ₹
                          {(group.test.originalSaleRate || 0).toFixed(2)}
                        </span>
                        <span>
                          Current Purchase Rate: ₹
                          {(group.test.purchasePrice || 0).toFixed(2)}
                        </span>
                        <span>
                          Current Sale Rate: ₹
                          {(group.test.saleRate || 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableCell className="font-medium">
                                Date
                              </TableCell>
                              <TableCell className="font-medium text-right">
                                Purchase Rate
                              </TableCell>
                              <TableCell className="font-medium text-right">
                                Sale Rate
                              </TableCell>
                              <TableCell className="font-medium">
                                Change
                              </TableCell>
                              <TableCell className="font-medium">
                                Reason
                              </TableCell>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.history.map((entry, entryIndex) => {
                              // Calculate previous entry for comparison
                              const prevEntry = group.history[entryIndex + 1];
                              const purchaseRateDiff = prevEntry
                                ? (entry.purchasePrice ||
                                    entry.purchasePrice ||
                                    0) -
                                  (prevEntry.purchasePrice ||
                                    prevEntry.purchasePrice ||
                                    0)
                                : 0;
                              const saleRateDiff = prevEntry
                                ? (entry.saleRate || 0) -
                                  (prevEntry.saleRate || 0)
                                : 0;

                              // Determine if this was an increase or decrease
                              const purchaseDirection =
                                purchaseRateDiff > 0
                                  ? "text-green-500"
                                  : purchaseRateDiff < 0
                                  ? "text-red-500"
                                  : "text-muted-foreground";

                              const saleDirection =
                                saleRateDiff > 0
                                  ? "text-green-500"
                                  : saleRateDiff < 0
                                  ? "text-red-500"
                                  : "text-muted-foreground";

                              // Format the date for display
                              const displayDate =
                                entry.date ||
                                (entry.fromDate
                                  ? new Date(entry.fromDate).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }
                                    )
                                  : "Unknown");

                              const displayPurchaseRate =
                                entry.purchasePrice || entry.purchasePrice || 0;

                              return (
                                <TableRow key={`entry-${entryIndex}`}>
                                  <TableCell className="whitespace-nowrap">
                                    {displayDate}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ₹{displayPurchaseRate.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ₹{(entry.saleRate || 0).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    {prevEntry && (
                                      <div className="flex flex-col text-xs">
                                        <span className={purchaseDirection}>
                                          Purchase:{" "}
                                          {purchaseRateDiff > 0 ? "+" : ""}
                                          {purchaseRateDiff.toFixed(2)}
                                          {purchaseRateDiff !== 0 && (
                                            <span className="ml-1">
                                              (
                                              {Math.abs(
                                                (purchaseRateDiff /
                                                  (prevEntry.purchasePrice ||
                                                    prevEntry.purchasePrice ||
                                                    1)) *
                                                  100
                                              ).toFixed(1)}
                                              %)
                                            </span>
                                          )}
                                        </span>
                                        <span className={saleDirection}>
                                          Sale: {saleRateDiff > 0 ? "+" : ""}
                                          {saleRateDiff.toFixed(2)}
                                          {saleRateDiff !== 0 && (
                                            <span className="ml-1">
                                              (
                                              {Math.abs(
                                                (saleRateDiff /
                                                  (prevEntry.saleRate || 1)) *
                                                  100
                                              ).toFixed(1)}
                                              %)
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="font-normal"
                                    >
                                      {entry.reason || "Rate Change"}
                                    </Badge>
                                    {entry.percentage &&
                                      entry.percentage > 0 && (
                                        <Badge
                                          variant="secondary"
                                          className="ml-2 font-normal"
                                        >
                                          {entry.percentage}% discount
                                        </Badge>
                                      )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end mb-4 gap-2">
          <Button
            onClick={() => handleAdd()}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add New
          </Button>

          {selectedItems.length > 0 && (
            <Button
              onClick={() => handleShowHistory(selectedItems)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" /> View History
            </Button>
          )}
        </div>

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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleShowHistory([item])}
                        >
                          <ClipboardList className="h-4 w-4 mr-2" />
                          View History
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

        {/* History Dialog - Fix z-index and cleanup on close */}
        <Dialog
          open={showHistoryModal}
          onOpenChange={(open) => {
            setShowHistoryModal(open);
            if (!open) {
              // Clear history items when dialog closes
              setHistoryItems([]);

              // Force reset document state
              setTimeout(() => {
                document.body.style.pointerEvents = "auto";
                document.body.style.overflow = "auto";
                document.body.style.paddingRight = "0px";
              }, 100);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[1000]">
            <DialogHeader>
              <DialogTitle>
                {historyItems.length > 1
                  ? `Price History (${historyItems.length} Tests)`
                  : `Price History: ${historyItems[0]?.name || "Test"}`}
              </DialogTitle>
              <DialogDescription>
                View historical price changes for the selected test(s)
              </DialogDescription>
            </DialogHeader>

            {renderHistoryContent()}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  safelyCloseModal(setShowHistoryModal);
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showBulkEditModal && (
          <Dialog
            open={showBulkEditModal}
            onOpenChange={(open) => {
              if (!open) safelyCloseModal(setShowBulkEditModal);
            }}
          >
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto z-[100]">
              <DialogHeader>
                <DialogTitle>Bulk Edit Items</DialogTitle>
                <DialogDescription>
                  Apply changes to {selectedItems.length} selected items
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
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
                        Apply a percentage discount to both purchase and sale
                        rates
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
                              value={purchaseRateValue ?? ""}
                              onChange={(e) =>
                                setPurchaseRateValue(
                                  e.target.value ? Number(e.target.value) : null
                                )
                              }
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
                              value={saleRateValue ?? ""}
                              onChange={(e) =>
                                setSaleRateValue(
                                  e.target.value ? Number(e.target.value) : null
                                )
                              }
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
                    Purchase rate will be set to ₹{purchaseRateValue} for all
                    selected items
                  </div>
                )}
                {saleRateValue !== null && (
                  <div className="text-xs text-muted-foreground">
                    Sale rate will be set to ₹{saleRateValue} for all selected
                    items
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => safelyCloseModal(setShowBulkEditModal)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkEditConfirm}
                  disabled={
                    (bulkEditPercentage <= 0 || bulkEditPercentage > 100) &&
                    purchaseRateValue === null &&
                    saleRateValue === null
                  }
                >
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
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
                    handleShowHistory(selectedItems);
                  }}
                  className="hover:bg-white/20 hover:text-white text-white p-2.5 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none"
                >
                  <Clock className="text-white" size={20} />
                  <span className="sr-only">View History</span>
                </Button>
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
          onOpenChange={(open) => {
            if (!open) {
              safelyCloseModal(setIsAddEditModalOpen);
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px] z-[100]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} Item</DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Make changes to the item"
                  : "Add a new item to the list"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {fields.map((field) => (
                <div
                  key={field.key as string}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <label
                    htmlFor={field.key as string}
                    className="text-right font-medium col-span-1"
                  >
                    {field.label}
                  </label>
                  <div className="col-span-3">
                    {field.key === "purchasePrice" ||
                    field.key === "saleRate" ? (
                      <div className="relative">
                        <Input
                          id={field.key as string}
                          type="number"
                          min="0"
                          step="1"
                          value={
                            editingItem
                              ? (editingItem[field.key] as string) || ""
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value
                              ? Number(e.target.value)
                              : 0;
                            setEditingItem((prev) => ({
                              ...(prev as T),
                              [field.key]: value,
                            }));
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
                        value={
                          editingItem
                            ? (editingItem[field.key] as string) || ""
                            : ""
                        }
                        onChange={(e) => {
                          const value = ["number", "tel"].includes(field.type)
                            ? Number(e.target.value)
                            : e.target.value;
                          setEditingItem((prev) => ({
                            ...(prev as T),
                            [field.key]: value,
                          }));
                        }}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => handleSave(editingItem as T)}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default DataTable;

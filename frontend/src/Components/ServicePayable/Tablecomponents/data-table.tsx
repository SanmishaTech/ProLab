"use client";

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
  onBulkEdit?: (discountPercentage: number, items: T[]) => void;
  selectedItems: T[];
  onSelectedItemsChange: (items: T[]) => void;
  itemsPerPage?: number;
  conflictchecks?: {
    type: 'associate' | 'department';
    value: number;
    isPercentage: boolean;
  }[];
}

function DataTable<T extends { 
  id: string | number; 
  _id: string | number;
  price?: number;
  name?: string;
  department?: string;
  associate?: string;
}>({
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
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | undefined>(undefined);
  const [bulkEditPercentage, setBulkEditPercentage] = useState(0);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictItems, setConflictItems] = useState<Array<{
    item: T;
    oldValue: number;
    newValue: number;
    selected: boolean;
    discountSource?: {
      type: 'associate' | 'department';
      value: number;
      isPercentage: boolean;
    };
  }>>([]);

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

  const handleBulkEditConfirm = (e: any) => {
    e.preventDefault();
    if (onBulkEdit) {
      // Check for conflicts and get discount sources
      const conflicts = selectedItems.filter(item => {
        const existingDiscount = item?.price ?? 0;
        return existingDiscount !== 0;
      }).map(item => {
        const discountSource = conflictchecks?.find(check => 
          (check.type === 'associate' && item.associate) || 
          (check.type === 'department' && item.department)
        );

        return {
          item,
          oldValue: item?.price ?? 0,
          newValue: (item?.price ?? 0) * (1 - bulkEditPercentage / 100),
          selected: false,
          discountSource
        };
      });

      if (conflicts.length > 0) {
        setConflictItems(conflicts);
        setShowConflictModal(true);
        setShowBulkEditModal(false);
      } else {
        onBulkEdit(bulkEditPercentage, selectedItems);
        onSelectedItemsChange([]);
        setBulkEditPercentage(0);
        setShowBulkEditModal(false);
      }
    }
  };

  const handleConflictResolution = () => {
    if (onBulkEdit) {
      // Get selected items from conflicts
      const selectedConflictItems = conflictItems
        .filter(conflict => conflict.selected)
        .map(conflict => conflict.item);

      // Get items without conflicts
      const nonConflictItems = selectedItems.filter(item => 
        !conflictItems.some(conflict => conflict.item._id === item._id)
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

  const toggleConflictItem = (index: number) => {
    setConflictItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAllConflictItems = (selected: boolean) => {
    setConflictItems(prev => 
      prev.map(item => ({ ...item, selected }))
    );
  };

  const handleRowClick = (item: T) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem._id === item._id);
    if (isSelected) {
      onSelectedItemsChange(selectedItems.filter(i => i._id !== item._id));
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
                    checked={data?.length > 0 && selectedItems?.length === data?.length}
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
                    selectedItems.some(i => i._id === item._id) ? 'bg-muted/30' : ''
                  }`}
                  onClick={(e) => {
                    // Don't trigger row click when clicking on checkbox or action buttons
                    if (
                      (e.target as HTMLElement).closest('.checkbox-cell') ||
                      (e.target as HTMLElement).closest('.action-cell')
                    ) {
                      return;
                    }
                    handleRowClick(item);
                  }}
                >
                  <TableCell className="checkbox-cell">
                    <Checkbox
                      checked={selectedItems?.some((i) => i._id === item._id)}
                      onCheckedChange={(checked) => handleSelectItem(item, checked as boolean)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {column.render
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
                <h3 className="text-lg font-bold">Apply Discount</h3>
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
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={bulkEditPercentage}
                      onChange={(e) => setBulkEditPercentage(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                      placeholder="Enter percentage"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

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
                  {bulkEditPercentage > 0 && (
                    <div className="text-xs text-muted-foreground">
                      This will apply a {bulkEditPercentage}% discount to all selected items
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBulkEditModal(false);
                      setBulkEditPercentage(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleBulkEditConfirm(e);
                    }}
                    disabled={bulkEditPercentage <= 0 || bulkEditPercentage > 100}
                  >
                    Apply Discount
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showConflictModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
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
                  The following items already have discounts applied. Select which items should receive the new discount.
                </p>
                <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 sticky top-0">
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={conflictItems.every(item => item.selected)}
                              onCheckedChange={(checked) => toggleAllConflictItems(!!checked)}
                            />
                            <span>Select All</span>
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left">Item</th>
                        <th className="py-3 px-4 text-right">Current Price</th>
                        <th className="py-3 px-4 text-right">New Price</th>
                        <th className="py-3 px-4 text-right">Difference</th>
                        <th className="py-3 px-4 text-center">Current Discount</th>
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
                          <td className="py-3 px-4">{conflict.item?.name ?? 'Unnamed Item'}</td>
                          <td className="py-3 px-4 text-right">{conflict.oldValue.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">{conflict.newValue.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-destructive">
                            {(conflict.newValue - conflict.oldValue).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {conflict.discountSource ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                  {conflict.discountSource.type === 'associate' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
                                  {conflict.discountSource.type === 'associate' ? 'Associate' : 'Department'}
                                </span>
                                <span className="text-sm font-medium">
                                  {conflict.discountSource.value}
                                  {conflict.discountSource.isPercentage ? '%' : ' Rs'}
                                </span>
                              </div>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {conflictItems.filter(item => item.selected).length} of {conflictItems.length} items selected
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
                    disabled={!conflictItems.some(item => item.selected)}
                  >
                    Apply Selected Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedItems && selectedItems.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform  bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-4">
            <span className="font-medium">
              {selectedItems?.length} item(s) selected
            </span>
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowBulkEditModal(true);
                }}
                className="hover:bg-destructive hover:text-destructive-foreground hover:scale-105 hover:cursor-pointer bg-transparent text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-pen-line"
                >
                  <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                  <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                  <path d="M8 18h1" />
                </svg>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSelectedItemsChange([]);
                }}
                className="hover:bg-destructive hover:text-destructive-foreground hover:scale-105 hover:cursor-pointer bg-transparent text-sm"
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
          </div>
        )}
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

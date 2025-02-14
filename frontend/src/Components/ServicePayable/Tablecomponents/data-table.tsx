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
  onBulkEdit?: (discountPercentage: number) => void;
  selectedItems: T[];
  onSelectedItemsChange: (items: T[]) => void;
  itemsPerPage?: number;
}

function DataTable<T extends { id: string | number }>({
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
}: DataTableProps<T>) {
  // const [selectedItemsa, setSelectedItems] = useState<T[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | undefined>(undefined);
  const [rowselected, setRowselected] = useState<boolean>(false);
  const [currentitem, setCurrentitem] = useState<T | undefined>(undefined);
  const [bulkEditPercentage, setBulkEditPercentage] = useState(0);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);

  // const handleSelectAll = (checked: boolean) => {
  //   setSelectedItems(checked ? data : []);
  // };

  useEffect(() => {
    if (rowselected) {
      const selected = selectedItems?.some((i) => i._id === currentitem._id);
      console.log("selected", !selected, !selectedItems?.includes(currentitem));
      handleSelectItem(currentitem, !selected);
    }
  }, [currentitem, rowselected]);

  // const handleSelectItem = (item: T, checked: boolean) => {
  //   console.log("This is checked", checked);
  //   // setSelectedItems((prev) =>
  //   //   checked ? [...prev, item] : prev.filter((i) => i._id !== item._id)
  //   // );
  //   console.log("Handleseelect", selectedItems.includes(item));
  //   // if (selectedItems.includes(item)) {
  //   //   return;
  //   // }
  //   if (checked) {
  //     setSelectedItems((prev) => [...prev, item]);
  //     console.log("checked true", selectedItems);
  //   }
  //   if (!checked) {
  //     setSelectedItems((prev) => prev.filter((i) => i._id !== item._id));
  //     console.log("checked true", selectedItems);
  //   }
  // };

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

  useEffect(() => {
    console.log("Selected uses", selectedItems);
  }, [selectedItems]);

  // useEffect(() => {
  //   if (data.length === 0) return;
  //   // Only update if there's a difference.
  //   const filteredData = data?.filter((item) =>
  //     selectedItems.some((selected) => selected._id === item._id)
  //   );
  //   console.log("Filtered data", filteredData);
  //   if (filteredData.length !== selectedItems.length) {
  //     onSelectedItemsChange(filteredData);
  //   }
  // }, [data]); // You might also need to include `selectedItems` in the dependency array

  const handleSelectAll = (checked: boolean) => {
    onSelectedItemsChange(checked ? data : []);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    onSelectedItemsChange(
      checked
        ? [...selectedItems, item]
        : selectedItems.filter((i) => i._id !== item._id)
    );
  };

  // Bulk edit handlers
  const handleBulkEditConfirm = () => {
    if (onBulkEdit) {
      onBulkEdit(bulkEditPercentage);
      // handleSelectItem(currentitem, false);
      onSelectedItemsChange([]);

      setBulkEditPercentage(0);
      setShowBulkEditModal(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* <div className="flex justify-end items-end">
      <Button
        onClick={handleAdd}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="mr-2 h-4 w-4" /> Add New
      </Button>
    </div> */}
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedItems?.length === data?.length}
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
                  className="hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    setRowselected(!rowselected);
                    setCurrentitem(item);
                  }} // Row click toggles selection
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems?.some((i) => i._id === item._id)}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item, checked as boolean)
                      }
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : (item[column.key] as React.ReactNode)}
                    </TableCell>
                  ))}
                  <TableCell>
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
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Apply Discount</h3>
              <input
                type="number"
                value={bulkEditPercentage}
                onChange={(e) => setBulkEditPercentage(Number(e.target.value))}
                className="border p-2 w-full mb-4"
                placeholder="Discount percentage"
              />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowBulkEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkEditConfirm}>Apply</Button>
              </div>
            </div>
          </div>
        )}
        {selectedItems && selectedItems.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-4">
            {console.log("Selected items", selectedItems)}
            <span className="font-medium">
              {selectedItems?.length} item(s) selected
            </span>
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDelete(selectedItems)}
                className="hover:bg-destructive hover:text-destructive-foreground hover:scale-105 hover:cursor-pointer bg-transparent text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-trash-2"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowBulkEditModal(true)}
                className="hover:bg-destructive hover:text-destructive-foreground hover:scale-105 hover:cursor-pointer bg-transparent text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-pen-line"
                >
                  <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                  <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                  <path d="M8 18h1" />
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

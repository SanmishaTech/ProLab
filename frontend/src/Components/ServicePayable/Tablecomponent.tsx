"use client";

import { useState, useEffect } from "react";
import DataTable from "./Tablecomponents/data-table";

interface Test {
  id: string | number;
  _id: string | number;
  name: string;
  email?: string;
  price: number;
  originalPrice?: number;
  department?: string;
  associate?: string;
}

interface Props {
  data: Test[];
  setUpdatedtests: (tests: Test[]) => void;
  setPercentagevalue: (value: number) => void;
  conflictchecks?: Array<{
    type: "associate" | "department";
    value: number;
    isPercentage: boolean;
  }>;
  onUpdateTests?: (
    testsToUpdate: Test[],
    discountPercentage: number
  ) => Promise<void>;
}

const columns: Array<{ key: keyof Test; header: string }> = [
  { key: "name", header: "Name" },
  { key: "email", header: "Date" },
  { key: "price", header: "Price" },
];

const fields: Array<{ key: keyof Test; label: string; type: string }> = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Date", type: "email" },
  { key: "price", label: "Price", type: "number" },
];

export default function Tablecomponent({
  data,
  setUpdatedtests,
  setPercentagevalue,
  conflictchecks,
  setSelectedAssociate,
  onUpdateTests,
}: Props) {
  const [users, setUsers] = useState<Test[]>([]);
  const [selectedItems, setSelectedItems] = useState<Test[]>([]);
  const [bulkEditPercentage, setBulkEditPercentage] = useState<number>(0);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
  const [conflictItems, setConflictItems] = useState<
    { item: Test; selected: boolean }[]
  >([]);

  useEffect(() => {
    // Initialize with original prices
    console.log("countingid ", data);
    const usersWithOriginal = data?.map((user) => ({
      ...user,
      id: user._id, // Ensure id is set
      originalPrice: user.originalPrice || user.price, // Use existing originalPrice or current price
    }));
    setUsers(usersWithOriginal);
  }, [data]);

  useEffect(() => {
    setUpdatedtests(users);
  }, [users, setUpdatedtests]);

  const handleAdd = (newUser: Test) => {
    const newId = Math.max(...users.map((u) => Number(u._id))) + 1;
    setUsers((prev) => [...prev, { ...newUser, _id: newId, id: newId }]);
  };

  const handleDelete = (usersToDelete: Test[]) => {
    setUsers((prev) =>
      prev.filter((user) => !usersToDelete.some((u) => u._id === user._id))
    );
  };

  const handleEdit = (editedUser: Test) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === editedUser._id ? editedUser : user))
    );
  };

  const handleBulkEdit = (discountPercentage: number) => {
    setPercentagevalue(discountPercentage);
    const updatedUsers = users.map((user) => {
      if (selectedItems.some((selected) => selected._id === user._id)) {
        const originalPrice = user.originalPrice || user.price;
        const discount = originalPrice * (discountPercentage / 100);
        return {
          ...user,
          price: originalPrice - discount,
          originalPrice: originalPrice, // Preserve original price
        };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <main className="container">
      <DataTable
        data={users}
        columns={columns}
        fields={fields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onBulkEdit={handleBulkEdit}
        onDelete={handleDelete}
        setSelectedAssociate={setSelectedAssociate}
        itemsPerPage={10}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        conflictchecks={conflictchecks}
      />
    </main>
  );
}

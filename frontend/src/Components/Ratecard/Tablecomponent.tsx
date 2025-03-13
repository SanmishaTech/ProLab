"use client";

import { useState, useEffect } from "react";
import DataTable from "./Tablecomponents/data-table";

interface Test {
  id: string | number;
  _id: string | number;
  name: string;
  email?: string;
  purchaseRate: number;
  saleRate: number;
  originalPurchaseRate?: number;
  originalSaleRate?: number;
  department?: string;
  associate?: string;
  date?: string;
}

interface ConflictCheck {
  type: "associate" | "department";
  value: number;
  isPercentage: boolean;
}

interface ConflictData {
  tests: {
    testId: {
      _id: string | number;
    };
    date: string;
  }[];
}

interface Props {
  data: Test[];
  setUpdatedtests: (tests: Test[]) => void;
  setPercentagevalue: (value: number) => void;
  conflictchecks?: ConflictCheck[];
  conflictData?: ConflictData;
  setSelectedAssociate?: (associate: any) => void;
  onUpdateTests?: (
    testsToUpdate: Test[],
    discountPercentage: number
  ) => Promise<void>;
}

const columns: Array<{ key: keyof Test; header: string }> = [
  { key: "name", header: "Name" },
  { key: "date", header: "Date" },
  { key: "purchaseRate", header: "Purchase Rate" },
  { key: "saleRate", header: "Sale Rate" },
];

const fields: Array<{ key: keyof Test; label: string; type: string }> = [
  { key: "name", label: "Name", type: "text" },
  { key: "date", label: "Date", type: "date" },
  { key: "purchaseRate", label: "Purchase Rate", type: "number" },
  { key: "saleRate", label: "Sale Rate", type: "number" },
];

export default function Tablecomponent({
  data,
  setUpdatedtests,
  setPercentagevalue,
  conflictchecks,
  conflictData,
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
    // Initialize with original purchase and sale rates and format date if available.
    console.log("data", data);
    const usersWithOriginal = data?.map((user) => ({
      ...user,
      id: user._id, // Ensure id is set
      date:
        conflictData?.tests?.find((test) => test.testId?._id === user._id)
          ?.date &&
        new Date(
          conflictData?.tests?.find(
            (test) => test.testId?._id === user._id
          )?.date
        )?.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
      originalPurchaseRate:
        user.originalPurchaseRate !== undefined
          ? user.originalPurchaseRate
          : user.purchaseRate,
      originalSaleRate:
        user.originalSaleRate !== undefined
          ? user.originalSaleRate
          : user.saleRate,
    }));
    setUsers(usersWithOriginal);
  }, [data, conflictData]);

  useEffect(() => {
    setUpdatedtests(users);
  }, [users, setUpdatedtests]);

  const handleAdd = (newUser: Test) => {
    const newId = Math.max(...users.map((u) => Number(u._id))) + 1;
    setUsers((prev) => [
      ...prev,
      {
        ...newUser,
        _id: newId,
        id: newId,
        originalPurchaseRate: newUser.purchaseRate,
        originalSaleRate: newUser.saleRate,
      },
    ]);
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

  // Update both purchase and sale rates using the discount percentage.
  // If the newly calculated rates are identical to the current ones, no update is performed.
  const handleBulkEdit = (discountPercentage: number) => {
    setPercentagevalue(discountPercentage);
    console.log("users", users);
    const updatedUsers = users.map((user) => {
      if (selectedItems.some((selected) => selected._id === user._id)) {
        const originalSale = user.originalSaleRate ?? user.saleRate;
        const originalPurchase = user.originalPurchaseRate ?? user.price;
        const newSaleRate = Math.ceil(
          originalSale - originalSale * (discountPercentage / 100)
        );
        const newPurchaseRate = Math.ceil(
          originalPurchase - originalPurchase * (discountPercentage / 100)
        );
        console.log("newPurchaseRate", originalPurchase);

        // Skip update if both new rates are same as the current ones.
        if (
          newSaleRate === user.saleRate &&
          newPurchaseRate === user.purchaseRate
        ) {
          return user;
        }

        const conflictTest = conflictData?.tests?.find(
          (test) => test.testId?._id === user._id
        );
        const formattedDate = conflictTest?.date
          ? new Date(conflictTest.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })
          : new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            });

        return {
          ...user,
          saleRate: newSaleRate,
          purchaseRate: newPurchaseRate,
          date: formattedDate,
          originalSaleRate: originalSale,
          originalPurchaseRate: originalPurchase,
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

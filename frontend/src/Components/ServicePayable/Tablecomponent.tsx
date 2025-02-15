"use client";

import { useState, useEffect } from "react";
import DataTable from "./Tablecomponents/data-table";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "price", header: "Price" },
];

const fields = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "role", label: "Role", type: "text" },
];

export default function Home({
  data,
  setUpdatedtests,
  setPercentagevalue,
  conflictchecks,
}) {
  // useEffect(() => {
  //   console.log("data", data);
  //   setUsers(data);
  // }, [data]);
  const [users, setUsers] = useState<User[]>();
  const [selectedItems, setSelectedItems] = useState<User[]>([]);

  const handleAdd = (newUser: User) => {
    setUsers((prev) => [
      ...prev,
      { ...newUser, _id: Math.max(...prev.map((u) => u._id)) + 1 },
    ]);
  };

  useEffect(() => {
    console.log("Updatedtests", users);
    setUpdatedtests(users);
  }, [users]);

  const handleDelete = (usersToDelete: User[]) => {
    setUsers((prev) =>
      prev.filter((user) => !usersToDelete.some((u) => u._id === user._id))
    );
  };

  useEffect(() => {
    // Initialize with original prices
    const usersWithOriginal = data.map((user) => ({
      ...user,
      originalPrice: user.price, // Store original price
    }));
    setUsers(usersWithOriginal);
  }, [data]);

  // useEffect(() => {
  //   const userwithupdatedprices = conflictchecks[0]?.test?.map((item) => {
  //     users?.map((user) => {
  //       console.log("userItem", user);
  //       if (item.testId === user._id) {
  //         console.log("item.value", user);
  //         return { ...user, price: item.value };
  //       }
  //     });
  //   });
  //   console.log("userwithupdatedprices", userwithupdatedprices);
  //   setUsers(userwithupdatedprices);
  // }, [conflictchecks]);

  const handleBulkEdit = (discountPercentage: number) => {
    setPercentagevalue(discountPercentage);
    const updatedUsers = users.map((user) => {
      if (selectedItems.some((selected) => selected._id === user._id)) {
        const discount = user.originalPrice * (discountPercentage / 100);
        return { ...user, price: user.originalPrice - parseInt(discount) };
      }
      return user;
    });
    console.log("Updated users", updatedUsers);
    setUsers(updatedUsers);
    // setSelectedItems([]);
  };

  return (
    <main className="container ">
      <DataTable
        data={users}
        columns={columns}
        fields={fields}
        onAdd={handleAdd}
        onBulkEdit={handleBulkEdit}
        onDelete={handleDelete}
        itemsPerPage={10}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        conflictchecks={conflictchecks}
      />
    </main>
  );
}

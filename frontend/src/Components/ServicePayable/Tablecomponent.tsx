"use client";

import { useState, useEffect } from "react";
import DataTable from "./Tablecomponents/data-table";

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

export default function Home({ data }) {
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

  const handleEdit = (discountPercentage) => {
    const updatedUsers = users.map((user) => {
      if (user._id) {
        // Assuming user.price holds the current price
        const discountAmount = user.price * (discountPercentage / 100);
        console.log("discountAmount", discountAmount);

        // Update the user object with the new discounted price
        return { ...user, price: Number(discountAmount) };
      }
      return user;
    });

    // Update the users state with the new prices
    setUsers(updatedUsers);
  };

  const handleDelete = (usersToDelete: User[]) => {
    setUsers((prev) =>
      prev.filter((user) => !usersToDelete.some((u) => u._id === user._id))
    );

    const filteredusers = users.filter((user) => {
      return !usersToDelete.some((u) => u.id === user.id);
    });
  };

  useEffect(() => {
    // Initialize with original prices
    const usersWithOriginal = data.map((user) => ({
      ...user,
      originalPrice: user.price, // Store original price
    }));
    setUsers(usersWithOriginal);
  }, [data]);

  const handleBulkEdit = (discountPercentage: number) => {
    const updatedUsers = users.map((user) => {
      if (selectedItems.some((selected) => selected._id === user._id)) {
        const discount = user.originalPrice * (discountPercentage / 100);
        return { ...user, price: user.originalPrice - parseInt(discount) };
      }
      return user;
    });
    setUsers(updatedUsers);
    setSelectedItems([]);
  };

  return (
    <main className="container ">
      <DataTable
        data={users}
        columns={columns}
        fields={fields}
        onAdd={handleAdd}
        onBulkEdit={handleBulkEdit} // New bulk edit handler
        onDelete={handleDelete}
        itemsPerPage={10}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
      />
    </main>
  );
}

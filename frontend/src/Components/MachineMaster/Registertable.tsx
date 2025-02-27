// components/Dashboardholiday.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem"; // Corrected import path
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "@/fetchcomponents/Fetchapi";
import { toast } from "sonner";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Define the schema with various input types
  const typeofschema = {
    name: { type: "String", label: "Machine Name" },
    model: { type: "String", label: "Machine Model" },
    companyName: { type: "String", label: "Company Name" },

    // sortBy: { type: "Number", label: "Sort By" },
    // date: { type: "Date", label: "Date" },
    // category: {
    //   type: "Select",
    //   label: "Category",
    //   options: [
    //     { value: "category1", label: "Category 1" },
    //     { value: "category2", label: "Category 2" },
    //     // Add more options as needed
    //   ],
    // },
    // isActive: { type: "Checkbox", label: "Is Active" },
    // isbol: { type: "Checkbox", label: "Is bol" },
    // Add more fields as needed
  };

  const {
    data: data1,
    isLoading: isLoading1,
    isFetching: isFetching1,
    isError: isError1,
  } = useFetchData({
    endpoint: `/api/machinemaster/allmachinemaster/${User?._id}`,
    params: {
      queryKey: ["machinemaster"],
      queryKeyId: User?._id,
      retry: 5,
      refetchOnWindowFocus: true,
      onSuccess: (res) => {
        toast.success("Successfully Fetched Data");
        console.log("This is res", res);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  });

  useEffect(() => {
    // Fetch data from the API

    // axios
    //   .get(`/api/machinemaster/allmachinemaster/${User?._id}`)
    //   .then((response) => {
    //     setData(response.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching data:", err);
    //     setError(err);
    //     setLoading(false);
    //   });

    // Define the dashboard configuration
    setConfig({
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Machine Master" },
      ],
      searchPlaceholder: "Search Machine Master...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Machine Master",
        description: "Manage Machine Master and view their details.",
        headers: [
          { label: "Machine Name", key: "name" },
          { label: "Machine Model", key: "model" },
          { label: "Company Name", key: "companyName" },
          { label: "Action", key: "action" },
        ],
        actions: [
          { label: "Edit", value: "edit" },
          { label: "Delete", value: "delete" },
        ],
        pagination: {
          from: 1,
          to: 10,
          total: 32,
        },
      },
    });
  }, [User?._id]);

  // Handlers for actions
  const handleAddProduct = () => {
    console.log("Add Parameter Group clicked");
    // The AddItem component now handles the modal, so no additional logic needed here
  };

  const handleExport = () => {
    console.log("Export clicked");
    // Implement export functionality such as exporting data as CSV or PDF
  };

  const handleFilterChange = (filterValue: string) => {
    console.log(`Filter changed: ${filterValue}`);
    // Implement filtering logic here, possibly refetching data with filters applied
  };

  const handleProductAction = (action: string, product: any) => {
    console.log(`Action: ${action} on product:`, product);
    if (action === "edit") {
      // Navigate to edit page or open edit modal
      // Example: window.location.href = `/parametergroup/update/${product._id}`;
    } else if (action === "delete") {
      // Implement delete functionality, possibly with confirmation
      // Example:
      /*
      if (confirm("Are you sure you want to delete this parameter group?")) {
        axios.delete(`/api/parametergroup/delete/${product._id}`)
          .then(() => {
            // Refresh data
            setData(prevData => prevData.filter(item => item._id !== product._id));
          })
          .catch(err => console.error(err));
      }
      */
    }
  };

  // Handler for adding a new item (optional if parent needs to do something)
  const handleAddItem = (newItem: any) => {
    console.log("New item added:", newItem);
    // Optionally, you can update the data state to include the new item without refetching
    setData((prevData) => [...prevData, newItem]);
  };

  if (isLoading1) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading parameters.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  if (!data1) return [];
  const mappedTableData = data1?.map((item) => {
    console.log("This is item", item);
    return {
      _id: item?._id,
      name: item?.name || "Machine Name not provided",
      model: item?.model || "Machine Model not provided",
      companyName: item?.companyName || "Company Name not provided",
      delete: `/machinemaster/delete/${item?._id}`,
      action: "actions", // Placeholder for action buttons
      // Additional fields can be added here
    };
  });

  return (
    <div className="p-4">
      <Dashboard
        breadcrumbs={config.breadcrumbs}
        searchPlaceholder={config.searchPlaceholder}
        userAvatar={config.userAvatar}
        tableColumns={config.tableColumns}
        tableData={mappedTableData}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onProductAction={handleProductAction}
        typeofschema={typeofschema}
        AddItem={() => (
          <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
        )}
      />
    </div>
  );
}

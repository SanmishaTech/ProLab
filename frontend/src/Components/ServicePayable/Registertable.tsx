// components/Dashboardholiday.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./TestCard"; // Corrected import path
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [parameter, setParameter] = useState<any[]>([]);
  const [parameterGroup, setParameterGroup] = useState<any[]>([]);
  const [test, setTest] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchparameter = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        console.log(response.data);
        setParameter(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchparametergroup = async () => {
      try {
        const response = await axios.get(
          `/api/associatemaster/allassociates/${User?._id}`
        );
        console.log("Parameterlink", response.data);
        setParameterGroup(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchparameter();
    fetchparametergroup();
  }, []);
  // Define the schema with various input types
  useEffect(() => {
    console.log("This is parameter", parameter);
    console.log("This is parameterGroup", parameterGroup);
    console.log("This is test", test);
  }, [parameter, parameterGroup, test]);
  const typeofschema = {
    associate: {
      type: "Select",
      label: "Associate",
      options:
        parameterGroup?.map((item) => ({
          value: item._id,
          label: item.firstName,
        })) || [],
    },
    test: {
      type: "Select",
      label: "Test",
      options:
        parameter?.map((item) => ({
          value: item._id,
          label: item.name,
        })) || [],
    },
    value: {
      type: "Number",
      label: "Value",
    },
  };

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/service/allservicepayable/${User?._id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err);
        setLoading(false);
      });

    // Define the dashboard configuration
    setConfig({
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Service Payable Master" },
      ],
      searchPlaceholder: "Search Service Payable   Master...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Service PayableMaster",
        description: "Manage Service Payable  Master and view their details.",
        headers: [
          { label: "Associates", key: "associate" },
          { label: "Tests", key: "test" },
          { label: "Value", key: "value" },
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
    if (action === "edit") {
      // The edit functionality is now handled by the EditItem component
      // You might want to store the selected item ID in state if needed
      setSelectedItemId(product._id);
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this item?")) {
        axios
          .delete(`/api/service/delete/${product._id}`)
          .then(() => {
            setData((prevData) =>
              prevData.filter((item) => item._id !== product._id)
            );
          })
          .catch((err) => {
            console.error("Error deleting item:", err);
            setError("Failed to delete item");
          });
      }
    }
  };

  // Handler for adding a new item (optional if parent needs to do something)
  const handleAddItem = async (updatedItem: any) => {
    try {
      console.log("Updated item received:", updatedItem);

      // Fetch fresh data from the API
      const response = await axios.get(
        `/api/service/allservicepayable/${User?._id}`
      );
      setData(response.data);

      // Clear the selected item
      setSelectedItemId(null);

      console.log("Data refreshed successfully");
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading parameters.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData = data
    ? data?.map((item) => {
        console.log("This is item", item);
        return {
          _id: item?._id,
          associate: item?.associate?.firstName,
          test: item?.test?.name,
          value: item?.value,
          delete: `service/delete/${item?._id}`,
          action: "actions", // Placeholder for action buttons
          // Additional fields can be added here
        };
      })
    : [];

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
        // AddItem={() => (
        //   <AddItem
        //     typeofschema={typeofschema}
        //     onAdd={() => {}}
        //     editid={selectedItemId}
        //   />
        // )}
      />
    </div>
  );
}

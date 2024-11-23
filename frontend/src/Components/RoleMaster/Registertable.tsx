// components/Dashboardholiday.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard, { description } from "./Dashboardreuse";
import AddItem from "./Additem"; // Corrected import path
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
  const [machine, setMachine] = useState<any[]>([]);
  const [test, setTest] = useState<any[]>([]);
  // const [filteredData, setFilteredData] = useState<any[]>([]); // State for filtered data
  // const [filterValue, setFilterValue] = useState<string>(""); // Store selected filter value

  useEffect(() => {
    // const fetchMachine = async () => {
    //   try {
    //     const response = await axios.get(`/api/discountmaster/alldiscount`);
    //     console.log("This is a mahcine", response.data);
    //     setMachine(response.data);
    //   } catch (error) {
    //     console.error("Error fetching machines:", error);
    //   }
    // };
    // const fetchTests = async () => {
    //   try {
    //     const response = await axios.get(`/api/promocodemaster/allpromocode`);
    //     console.log(response.data);
    //     setTest(response.data);
    //   } catch (error) {
    //     console.error("Error fetching tests:", error);
    //   }
    // };
    // fetchMachine();
    // fetchTests();
  }, []);

  // Define the schema with various input types
  const typeofschema = {
    role: {
      type: "String",
      label: "Role",
    },
    description: {
      type: "String",
      label: "Description",
    },

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

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/rolemaster/allrole`)
      .then((response) => {
        setData(response.data);
        // setFilteredData(response.data);
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
        { label: "Role Master" },
      ],
      searchPlaceholder: "Search Role...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Role",
        description: "Manage Role and view their details.",
        headers: [
          { label: "Role", key: "role" },
          { label: "Description", key: "description" },
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
    setFilterValue(filterValue); // Store the selected filter value
    // if (filterValue === "") {
    //   setFilteredData(data); // If no filter, show all data
    // } else {
    //   const filtered = data.filter((item) => item.discountType === filterValue);
    //   setFilteredData(filtered); // Filter data based on the selected discountType
    // }
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading machines.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  if (!data) return [];
  const mappedTableData =
    data && Array.isArray(data)
      ? data.map((item) => {
          return {
            _id: item?._id,
            role: item?.role || "Role not provided",
            description: item?.description || "Description not provided",
            delete: `/rolemaster/delete/${item?._id}`,
            action: "actions", // Placeholder for action buttons
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
        // filterValue={filterValue}
        AddItem={() => (
          <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
        )}
      />
    </div>
  );
}

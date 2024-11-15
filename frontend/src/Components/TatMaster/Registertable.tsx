import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem";
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const typeofschema = {
    selectTest: { type: "String", label: "Select Test" },
    startTime: { type: "String", label: "Start Time" },
    endTime: { type: "String", label: "End Time" },
    hoursNeeded: { type: "Number", label: "Hours Needed" },
    urgentHours: { type: "Number", label: "Urgent Hours" },
     
  };
  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/tatmaster/alltatmaster`)
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
        { label: "TaT Master" },
      ],
      searchPlaceholder: "Search registrations...",
      userAvatar: "/path-to-avatar.jpg",
      tableColumns: {
        title: "TaT Master",
        description: "Manage TaT Master and view their details.", 
        headers: [
          { label: "Select Test", key: "one" },
          { label: "Start Time", key: "two" },
          { label: "End Time", key: "three" },
          { label: "Hours Needed", key: "four" },
          { label: "Urgent Hours", key: "five" },
          { label: "Weekday", key: "six" },
          { label: "Action", key: "action" },
        ],
        // tabs: [
        //   { label: "All", value: "all" },
        //   { label: "Active", value: "active" },
        //   { label: "Completed", value: "completed" },
        // ],
        // filters: [
        //   { label: "Active", value: "active", checked: true },
        //   { label: "Completed", value: "completed", checked: false },
        // ],
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
    console.log("Add Registration clicked");

    // For example, navigate to an add registration page or open a modal
  };

  const handleExport = () => {
    console.log("Export clicked");
    // Implement export functionality such as exporting data as CSV or PDF
  };

  const handleFilterChange = (filterValue) => {
    console.log(`Filter changed: ${filterValue}`);
    // You can implement filtering logic here, possibly refetching data with filters applied
  };

  const handleProductAction = (action, product) => {
    console.log(`Action: ${action} on registration:`, product);
    if (action === "edit") {
      // Navigate to edit page or open edit modal
    } else if (action === "delete") {
      // Implement delete functionality, possibly with confirmation
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading registrations.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData = data?.map((item) => {
    const services = item?.services || [];
    
    // Capitalize the first letter of each weekday
    const capitalizedWeekday = item?.weekday?.map(day => {
      return day.charAt(0).toUpperCase() + day.slice(1); // Capitalize first letter
    }) || ["Weekday not provided"];

    
  
    return {
      _id: item?._id,
      one: item?.selectTest?.name || "Select Test not provided",
      two: item?.startTime || "Start Time not provided",
      three: item?.endTime || "End Time not provided",
      four: item?.hoursNeeded || "Hours Needed not provided",
      five: item?.urgentHours || "Urgent Hours not provided",
      six: capitalizedWeekday.join(", ") || "Weekday not provided",  // Join the weekdays into a string
  
      delete: `/tatmaster/delete/${item?._id}`,
      editfetch: `/tatmaster/reference/${item?._id}`,
    };
  });

  return (
    <div className="p-4">
      <Dashboard
        breadcrumbs={config.breadcrumbs}
        searchPlaceholder={config.searchPlaceholder}
        userAvatar={userAvatar}
        tableColumns={config.tableColumns}
        tableData={mappedTableData}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onProductAction={handleProductAction}
        AddItem={AddItem}
        typeofschema={typeofschema}
      />
    </div>
  );
}

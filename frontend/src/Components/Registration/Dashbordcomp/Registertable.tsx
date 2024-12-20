import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import userAvatar from "@/images/Profile.jpg";

export default function RegistrationsPage() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`/api/registration/allregistration/${User?._id}`)
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
        { label: "Registrations" },
      ],
      searchPlaceholder: "Search registrations...",
      userAvatar: "/path-to-avatar.jpg",
      tableColumns: {
        title: "Registrations",
        description: "Manage patient registrations and view their details.",
        headers: [
          { label: "Name", key: "patientName" },
          { label: "Age", key: "patientAge" },
          { label: "Gender", key: "gender" },
          { label: "Phone", key: "phone" },
          { label: "Amount due", key: "balanceAmount" },
          { label: "Paid Amount", key: "paymentMode" },
          // { label: "Report Due", key: "referralName" },
          { label: "Report Due Date", key: "dueDate" },
          // { label: "Referral", key: "referralName" },
        ],
        tabs: [
          { label: "All", value: "all" },
          { label: "Active", value: "active" },
          { label: "Completed", value: "completed" },
        ],
        filters: [
          { label: "Active", value: "active", checked: true },
          { label: "Completed", value: "completed", checked: false },
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
    const Tests = item?.tests || [];
    const paidAmount = item?.paymentMode?.paidAmount || 0;

    // Calculate the total service price based on each service's populated details.
    // const totalServicePrice = services.reduce((acc, service) => {
    //   const servicePrice = service?.serviceId?.price || 0; // Replace 'price' with the actual field name for service price
    //   return acc + servicePrice;
    // }, 0);

    // Calculate balance amount based on total service price and paid amount.
    // const balanceAmount =
    //   totalServicePrice - paidAmount > 0 ? totalServicePrice - paidAmount : 0;
    var TotalPaid = 0;

    item?.paymentMode.map((payment) => {
      TotalPaid += payment.paidAmount;
    });
    // console.log("Services", services);
    const Age = new Date(item?.patientId?.age)?.toLocaleDateString();
    const SubmissionDate = new Date(item?.completionDate)?.toLocaleDateString();
    return {
      _id: item?._id,
      patientName: item?.patientId?.firstName || "Patient Name Not Found",
      patientAge: Age || "No age mentioned",
      gender: item?.patientId?.gender || "No gender mentioned",
      phone: item?.patientId?.mobile || "No phone Mentioned",
      // balanceAmount: balanceAmount || 0, // Calculate balance amount
      paymentMode: TotalPaid || "Payment not provided",
      // referralName: item?.completionDays || "Due date not provided",
      // referralName: item?.referral?.name || "N/A",
      dueDate: SubmissionDate || "Due date not provided",
      Tests: Tests.map((test) => ({
        name: test?.tests?.name,
        description: test?.tests?.paymentMode?.paidAmount,
        urgent: test?.urgent ? "Yes" : "No",
        price: test?.tests?.price || 0,
      })), // Display service details (name, price, urgent status)
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
      />
    </div>
  );
}

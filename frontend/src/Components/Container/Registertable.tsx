import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
import AddItem from "./Additem";
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/fetchcomponents/Fetchapi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [config, setConfig] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // You can change the limit if needed
  const [search, setSearch] = useState("");

  const typeofschema = {
    container: {
      type: "String",
      label: "Container",
    },
  };

  const fetchProjects = async ({ queryKey }) => {
    const [_key, { currentPage, search }] = queryKey;
    const response = await axios.get(
      `/api/container/search/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`
    );
    setTotalPages(response.data?.totalPages);
    return response.data.patients;
  };
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["container"] });
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // const {
  //   data: data1,
  //   isLoading: isLoading1,
  //   isFetching: isFetching1,
  //   isError: isError1,
  // } = useFetchData({
  //   endpoint: `/api/container/allcontainer/${User?._id}`,
  //   params: {
  //     queryKey: ["container"],
  //     queryKeyId: User?._id,
  //     retry: 5,
  //     refetchOnWindowFocus: true,
  //     onSuccess: (res) => {
  //       toast.success("Successfully Fetched Data");
  //       console.log("This is res", res);
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //   },
  // });

  const {
    data: data1,
    isLoading: isLoading1,
    isFetching: isFetching1,
    // isError: fetchError,
  } = useFetchData({
    endpoint: `/api/container/search/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`,
    params: {
      queryKey: ["container", { currentPage, search }],
      // queryKeyId: User?._id,
      queryFn: fetchProjects,
      enabled: !!User?._id,

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
    //   .get(`/api/container/allcontainer/${User?._id}`)
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
        { label: "Container" },
      ],
      searchPlaceholder: "Search registrations...",
      userAvatar: "/path-to-avatar.jpg",
      tableColumns: {
        title: "Container",
        description: "Manage Container and view their details.",
        headers: [
          { label: "Container", key: "one" },
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

  if (isLoading1) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading registrations.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData = data1?.map((item) => {
    const services = item?.services || [];
    const paidAmount = item?.paymentMode?.paidAmount || 0;

    // Calculate the total service price based on each service's populated details.
    const totalServicePrice = services.reduce((acc, service) => {
      const servicePrice = service?.serviceId?.price || 0; // Replace 'price' with the actual field name for service price
      return acc + servicePrice;
    }, 0);

    // Calculate balance amount based on total service price and paid amount.
    const balanceAmount =
      totalServicePrice - paidAmount > 0 ? totalServicePrice - paidAmount : 0;
    return {
      _id: item?._id,
      one: item?.container || "Unknown",
      edit: `container/update/${item?._id}`,
      delete: `container/delete/${item?._id}`,
      editfetch: `container/reference/${item?._id}`,
      // two: item?. || "Unknown",
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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onProductAction={handleProductAction}
        AddItem={AddItem}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        typeofschema={typeofschema}
      />
    </div>
  );
}

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
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboardholiday() {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user || "{}");
  const [config, setConfig] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [machine, setMachine] = useState<any[]>([]);
  const [test, setTest] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // You can change the limit if needed
  const [search, setSearch] = useState("");

  const fetchProjects = async ({ queryKey }) => {
    const [_key, { currentPage, search }] = queryKey;
    const response = await axios.get(
      `/api/machinelinkmaster/search/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`
    );
    setTotalPages(response.data?.totalPages);
    return response.data.patients;
  };
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["machinelinkmaster"] });
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

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const response = await axios.get(
          `/api/machinemaster/allmachinemaster/${User?._id}`
        );
        console.log("This is a mahcine", response.data);
        setMachine(response.data);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        console.log(response.data);
        setTest(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchMachine();
    fetchTests();
  }, []);

  // Define the schema with various input types
  const typeofschema = {
    name: {
      type: "Select",
      label: "Machine Name",
      options: machine?.map((machine) => ({
        value: machine?._id,
        label: machine?.name,
      })),
    },
    test: {
      type: "Select",
      label: "Test Name",
      options: test?.map((test) => ({
        value: test?._id,
        label: test?.name,
      })),
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

  // const {
  //   data: data1,
  //   isLoading: isLoading1,
  //   isFetching: isFetching1,
  //   isError: isError1,
  // } = useFetchData({
  //   endpoint: `/api/machinelinkmaster/allmachinelinkmaster/${User?._id}`,
  //   params: {
  //     queryKey: ["machinelinkmaster"],
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
    endpoint: `/api/machinelinkmaster/search/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`,
    params: {
      queryKey: ["machinelinkmaster", { currentPage, search }],
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
    //   .get(`/api/machinelinkmaster/allmachinelinkmaster/${User?._id}`)
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
        { label: "Test Machine Link" },
      ],
      searchPlaceholder: "Search Test Machine Link...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Test Machine Link",
        description: "Manage Test Machine Link and view their details.",
        headers: [
          { label: "Machine Name", key: "name" },
          { label: "Test Name", key: "test" },
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

  // if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading machines.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  if (!data1) return [];
  const mappedTableData = data1?.map((item) => {
    return {
      _id: item?._id,
      name: item?.name?.name || "Machine Name not provided",
      test: item?.test?.name || "Test Name not provided",
      delete: `/machinelinkmaster/delete/${item?._id}`,
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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        tableData={mappedTableData}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onProductAction={handleProductAction}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        typeofschema={typeofschema}
        AddItem={() => (
          <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
        )}
      />
    </div>
  );
}

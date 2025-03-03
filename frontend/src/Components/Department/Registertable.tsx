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
  const [parameter, setParameter] = useState<any[]>([]);
  const [parameterGroup, setParameterGroup] = useState<any[]>([]);
  const [test, setTest] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // You can change the limit if needed
  const [search, setSearch] = useState("");

  const fetchProjects = async ({ queryKey }) => {
    const [_key, { currentPage, search }] = queryKey;
    const response = await axios.get(
      `/api/department/search/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`
    );
    setTotalPages(response.data?.totalPages);
    return response.data.patients;
  };

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

  const {
    data: PaginatedData,
    error: fetchError,
    isLoading,
  } = useQuery({
    queryKey: ["projects", { currentPage, search }],
    queryFn: fetchProjects,
    enabled: !!User?._id,
  });

  useEffect(() => {
    // Fetch data from the API
    const fetchparameter = async () => {
      try {
        const response = await axios.get(
          `/api/parameter/allparameter/${User?._id}`
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
          `/api/parametergroup/allparametergroup/${User?._id}`
        );
        console.log(response.data);
        setParameterGroup(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchtest = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        console.log(response.data);
        setTest(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchparameter();
    fetchparametergroup();
    fetchtest();
  }, []);
  // Define the schema with various input types

  const typeofschema = {
    name: {
      type: "String",
      label: "Department Name",
    },
    description: {
      type: "String",
      label: "Description",
    },
    adn: {
      type: "String",
      label: "Alternate Description",
    },
    interpretation: {
      type: "Checkbox",
      label: "show interpretation?",
    },
    approval: {
      type: "Checkbox",
      label: "Departmentwise Approval?",
    },
    referenceNo: {
      type: "Checkbox",
      label: "Generate reference Number",
    },
  };

  // const {
  //   data: data1,
  //   isLoading: isLoading1,
  //   isFetching: isFetching1,
  //   isError: isError1,
  // } = useFetchData({
  //   endpoint: `/api/department/alldepartment/${User?._id}`,
  //   params: {
  //     queryKey: ["department"],
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
    endpoint: `/api/department/search/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`,
    params: {
      queryKey: ["department", { currentPage, search }],
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
    console.log("This is data1", data1);
  }, [data1]);

  useEffect(() => {
    // Fetch data1 from the API
    // axios
    //   .get(`/api/department/alldepartment/${User?._id}`)
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
        { label: "Department Master" },
      ],
      searchPlaceholder: "Search Department Master...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Department Master",
        description: "Manage Department Master and view their details.",
        headers: [
          { label: "Name", key: "name" },
          { label: "Description", key: "description" },
          { label: "Alternate Description", key: "adn" },
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
    if (data1.includes(newItem)) {
      console.log("exists");
    } else {
      setData((prevData) => [...prevData, newItem]);
    }
  };

  if (isLoading1) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading parameters.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData = data1
    ? data1?.map((item) => {
        console.log("This is item", item);
        return {
          _id: item?._id,
          name: item?.name || "Name not provided",
          description: item?.description || "Description not provided",
          adn: item?.adn || "Alternate Description not provided",
          delete: `/department/delete/${item?._id}`,
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
        onAddProduct={handleAddItem}
        data={data1}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        onProductAction={handleProductAction}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        typeofschema={typeofschema}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        AddItem={() => (
          <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
        )}
      />
    </div>
  );
}

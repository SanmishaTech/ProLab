// components/Dashboardholiday.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboardreuse";
// import AddItem from "./Additem"; // Corrected import path
import userAvatar from "@/images/Profile.jpg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "@/fetchcomponents/Fetchapi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const AddItem = () => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/testmaster/add");
  };
  return (
    <Button onClick={handleAdd} variant="outline">
      Add Test
    </Button>
  );
};
const Edititem = (id: string) => {
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate(`/testmaster/edit/${id?.id}`);
  };
  return (
    <Button onClick={handleAdd} variant="ghost" className="w-full">
      Edit Test
    </Button>
  );
};

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
      `/api/testmaster/searchalltest/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`
    );
    setTotalPages(response.data?.totalPages);
    return response.data.patients;
  };
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["testmaster"] });
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      console.log("This is current page", currentPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      console.log("This is prev page", currentPage);

      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    // Fetch data from the API
    // const fetchparameter = async () => {
    //   try {
    //     const response = await axios.get(
    //       `/api/testmaster/alltestmaster/${User?._id}`
    //     );
    //     console.log(response.data);
    //     setParameter(response.data);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    const fetchparametergroup = async () => {
      try {
        const response = await axios.get(
          `/api/testmaster/alltestmaster/${User?._id}`
        );
        console.log(response.data);
        setParameterGroup(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchtest = async () => {
      try {
        const response = await axios.get(`/api/testmaster/alltestmaster`);
        console.log(response.data);
        setTest(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // fetchparameter();
    // fetchparametergroup();
    // fetchtest();
  }, []);
  // Define the schema with various input types
  useEffect(() => {
    console.log("This is parameter", parameter);
    console.log("This is parameterGroup", parameterGroup);
    console.log("This is test", test);
  }, [parameter, parameterGroup, test]);
  const typeofschema = {
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
  //   endpoint: `/api/testmaster/alltestmaster/${User?._id}`,
  //   params: {
  //     queryKey: ["testmaster"],
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
    data: PaginatedData,
    isLoading: isLoading1,
    isFetching: isFetching1,
    isError: fetchError,
  } = useFetchData({
    endpoint: `/api/testmaster/searchalltest/${User?._id}?page=${currentPage}&limit=${limit}&search=${search}`,
    params: {
      queryKey: ["testmaster", { currentPage, search }],
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
    //   .get(`/api/testmaster/alltestmaster/${User?._id}`)
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
        { label: "Test  Master" },
      ],
      searchPlaceholder: "Search Test Master...",
      userAvatar: userAvatar, // Use the imported avatar
      tableColumns: {
        title: "Test Master",
        description: "Manage Test Master and view their details.",
        headers: [
          { label: "Test Name", key: "name" },
          { label: "Test code", key: "code" },
          { label: "Test price", key: "price" },
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

  // if (isLoading1) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading parameters.</div>;
  if (!config) return <div className="p-4">Loading configuration...</div>;

  // Map the API data to match the Dashboard component's expected tableData format
  const mappedTableData = PaginatedData
    ? PaginatedData?.map((item) => {
        console.log("This is item", item);
        return {
          _id: item?._id,
          name: item?.name || "Test Name not provided",
          code: item?.code || "Test Code not provided",
          price: item?.price || "Price not provided",
          delete: `/testmaster/delete/${item?._id}`,
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
        Edititem={Edititem}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onFilterChange={handleFilterChange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        filterValue={PaginatedData}
        onProductAction={handleProductAction}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        setSearch={setSearch}
        Searchitem={search}
        typeofschema={typeofschema}
        AddItem={() => (
          <AddItem typeofschema={typeofschema} onAdd={handleAddItem} />
        )}
      />
    </div>
  );
}

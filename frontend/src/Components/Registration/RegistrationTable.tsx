import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DashboardImage from "@/images/darkbackground.jpg";
import { Servicesdisplay } from "./Servicesdisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; // Ensure DialogTrigger is imported
import { useForm } from "react-hook-form";

export function RegistrationComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for current report (used for Edit and Delete)
  const [currentReport, setCurrentReport] = useState(null);

  // Form management using react-hook-form
  const { register, handleSubmit, reset, setValue } = useForm();

  // Intersection Observer for infinite scrolling
  const { ref, inView } = useInView();

  // API base URL
  const API_BASE_URL = "/api/registration";

  // Fetch reports with pagination
  const fetchReports = async ({ pageParam = 1 }) => {
    const response = await axios.get(API_BASE_URL, {
      params: {
        page: pageParam,
        limit: 10, // Number of items per page
        // Add other query params like search or status if needed
      },
    });
    console.log(response.data);
    return response.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Mutations for CRUD operations
  const createReportMutation = useMutation({
    mutationFn: (newReport) => axios.post(API_BASE_URL, newReport),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      reset();
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: ({ id, updatedReport }) =>
      axios.put(`${API_BASE_URL}/${id}`, updatedReport),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      setCurrentReport(null);
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_BASE_URL}/service/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      setCurrentReport(null);
    },
  });

  if (error) return <div>Failed to load reports</div>;

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-lightps/40">
      {/* Sidebar and Header */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Sidebar Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  {/* <ShoppingCart className="h-5 w-5" /> */}
                  Orders
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Reports
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  {/* <Users2 className="h-5 w-5" /> */}
                  Customers
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Breadcrumb */}
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="#">Registration</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Registration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Search */}
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-light pl-8 md:w-[200px] lg:w-[336px] border-[#3D3D3D]"
            />
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full border-[#3D3D3D]"
              >
                <img
                  src={DashboardImage}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList className="bg-light">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inprogress">In Progress</TabsTrigger>
                <TabsTrigger value="completed" className="hidden sm:flex">
                  Completed
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 bg-light border-[#3D3D3D]"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-light">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      In Progress
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Completed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 bg-light border-[#3D3D3D]"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                {/* Add Service Button with DialogTrigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="md"
                      className="h-9 gap-2 bg-accent text-black hover:bg-accent/90"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Service
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Report</DialogTitle>
                      <DialogDescription>
                        Fill in the details of the new lab report.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmit((data) =>
                        createReportMutation.mutate(data)
                      )}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium">
                          Title
                        </label>
                        <Input
                          {...register("name", { required: true })}
                          placeholder="Add Service Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Description
                        </label>
                        <Input
                          {...register("description", { required: true })}
                          placeholder="Service Description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Status
                        </label>
                        <select
                          {...register("status", { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Created By
                        </label>
                        <Input
                          {...register("createdBy", { required: true })}
                          placeholder="Author Name"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={createReportMutation.isLoading}
                        >
                          {createReportMutation.isLoading
                            ? "Adding..."
                            : "Add Report"}
                        </Button>
                        <DialogTrigger asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogTrigger>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="all">
              <Card className="max-h-[80vh] overflow-hidden bg-light border-0">
                <CardHeader>
                  <CardTitle>Registration Details</CardTitle>
                  <CardDescription>
                    Manage your Registrations here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <ScrollArea className="w-full h-[80vh]">
                      <TableHeader>
                        <TableRow className="hover:bg-lightps">
                          <TableHead>Actions</TableHead>
                          <TableHead>Patient Name</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Doctor
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Payment Mode
                          </TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="h-full">
                        {data?.pages?.map((page, pageIndex) => (
                          <React.Fragment key={pageIndex}>
                            {page?.map((report) => (
                              <React.Fragment key={report._id}>
                                <TableRow className="hover:bg-nav/50">
                                  <TableCell className="hidden sm:table-cell min-w-[200px]">
                                    <Button
                                      onClick={() =>
                                        setCurrentReport((prev) =>
                                          prev === report ? null : report
                                        )
                                      }
                                    >
                                      {currentReport === report
                                        ? "Collapse"
                                        : "Expand"}
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    {report?.patientId?.name}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    {report?.referral?.name}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    {report.paymentMode}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                          >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                              Toggle menu
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>
                                            Actions
                                          </DropdownMenuLabel>
                                          <DropdownMenuItem>
                                            {/* Edit Dialog */}
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <span
                                                  onClick={() =>
                                                    setCurrentReport(report)
                                                  }
                                                  className="block w-full"
                                                >
                                                  Edit
                                                </span>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>
                                                    Edit Report
                                                  </DialogTitle>
                                                  <DialogDescription>
                                                    Update the details of the lab
                                                    report.
                                                  </DialogDescription>
                                                </DialogHeader>
                                                {currentReport && (
                                                  <form
                                                    onSubmit={handleSubmit(
                                                      (data) =>
                                                        updateReportMutation.mutate(
                                                          {
                                                            id: currentReport._id,
                                                            updatedReport: data,
                                                          }
                                                        )
                                                    )}
                                                    className="space-y-4"
                                                  >
                                                    <div>
                                                      <label className="block text-sm font-medium">
                                                        Name
                                                      </label>
                                                      <Input
                                                        {...register("name", {
                                                          required: true,
                                                        })}
                                                        placeholder="Service Title"
                                                        defaultValue={
                                                          currentReport.name
                                                        }
                                                      />
                                                    </div>
                                                    <div>
                                                      <label className="block text-sm font-medium">
                                                        Description
                                                      </label>
                                                      <Input
                                                        {...register(
                                                          "description",
                                                          {
                                                            required: false,
                                                          }
                                                        )}
                                                        placeholder="Service Description"
                                                        defaultValue={
                                                          currentReport.description
                                                        }
                                                      />
                                                    </div>
                                                    <div>
                                                      <label className="block text-sm font-medium">
                                                        Status
                                                      </label>
                                                      <select
                                                        {...register("status", {
                                                          required: true,
                                                        })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        defaultValue={
                                                          currentReport.status
                                                        }
                                                      >
                                                        <option>Pending</option>
                                                        <option>
                                                          In Progress
                                                        </option>
                                                        <option>Completed</option>
                                                      </select>
                                                    </div>
                                                    <div>
                                                      <label className="block text-sm font-medium">
                                                        Created By
                                                      </label>
                                                      <Input
                                                        {...register(
                                                          "createdBy",
                                                          {
                                                            required: true,
                                                          }
                                                        )}
                                                        placeholder="Author Name"
                                                        defaultValue={
                                                          currentReport.createdBy
                                                        }
                                                      />
                                                    </div>
                                                    <DialogFooter>
                                                      <Button
                                                        type="submit"
                                                        disabled={
                                                          updateReportMutation.isLoading
                                                        }
                                                      >
                                                        {updateReportMutation.isLoading
                                                          ? "Updating..."
                                                          : "Save Changes"}
                                                      </Button>
                                                      <DialogTrigger asChild>
                                                        <Button variant="ghost">
                                                          Cancel
                                                        </Button>
                                                      </DialogTrigger>
                                                    </DialogFooter>
                                                  </form>
                                                )}
                                              </DialogContent>
                                            </Dialog>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            {/* Delete Confirmation Dialog */}
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <span
                                                  onClick={() =>
                                                    setCurrentReport(report)
                                                  }
                                                  className="block w-full"
                                                >
                                                  Delete
                                                </span>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>
                                                    Delete Report
                                                  </DialogTitle>
                                                  <DialogDescription>
                                                    Are you sure you want to
                                                    delete{" "}
                                                    {currentReport &&
                                                      currentReport.name}
                                                    ? This action cannot be
                                                    undone.
                                                  </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                  <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                      deleteReportMutation.mutate(
                                                        currentReport._id
                                                      )
                                                    }
                                                    disabled={
                                                      deleteReportMutation.isLoading
                                                    }
                                                  >
                                                    {deleteReportMutation.isLoading
                                                      ? "Deleting..."
                                                      : "Delete"}
                                                  </Button>
                                                  <DialogTrigger asChild>
                                                    <Button variant="ghost">
                                                      Cancel
                                                    </Button>
                                                  </DialogTrigger>
                                                </DialogFooter>
                                              </DialogContent>
                                            </Dialog>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() =>
                                                navigate(`/registration/payment/${report._id}`)
                                              }
                                              className="text-blue-600 hover:text-blue-800"
                                            >
                                              💰
                                              <span className="sr-only">Payment</span>
                                            </Button>
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </TableCell>
                                </TableRow>

                                {/* Expanded content */}
                                {currentReport === report && (
                                  <TableRow className="w-full hover:bg-[#000000]">
                                    <TableCell
                                      colSpan={5}
                                      className="w-full hover:bg-[#000000]"
                                    >
                                      <div className="w-full">
                                        <Servicesdisplay
                                          invoices={report?.services}
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ))}

                        <div ref={ref} className="h-[100px]"></div>
                      </TableBody>
                    </ScrollArea>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    {isFetching && !isFetchingNextPage ? "Fetching..." : ""}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Edit Report Dialog is now handled within the DropdownMenuItem */}

      {/* Delete Confirmation Dialog is now handled within the DropdownMenuItem */}
    </div>
  );
}

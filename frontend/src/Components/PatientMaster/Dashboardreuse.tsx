import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  File,
  PlusCircle,
  Search,
  Pencil,
  Trash,
  MoreHorizontal,
  ListFilter,
} from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import AlertDialogbox from "./AlertBox";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
// import Edititem from "./Edititem";
import { EmptyState } from "@/components/ui/empty-state";
import {
  FileText,
  MessageSquare,
  Mail,
  Image,
  Files,
  FileQuestion,
  FileSymlink,
  Settings,
} from "lucide-react";

export const description =
  "A reusable registrations dashboard with customizable header and table. Configure breadcrumbs, search, tabs, and table data through props.";

export default function Dashboard({
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  userAvatar = "/placeholder-user.jpg",
  tableColumns = {},
  AddItem,
  Edititem,
  filterValue,
  typeofschema,
  handleNextPage,
  totalPages,
  setSearch,
  setCurrentPage,
  Searchitem,
  currentPage,
  handlePrevPage,
  tableData = [],
  onAddProduct = () => {},
  onExport = () => {},
  onFilterChange = () => {},
  onProductAction = () => {},
}) {
  const navigate = useNavigate();
  const [toggleedit, setToggleedit] = useState(false);
  const [editid, setEditid] = useState();
  const [toggledelete, setToggledelete] = useState();
  // State to manage expanded rows (array of _id)
  const [expandedRows, setExpandedRows] = useState([]);

  // Handler to toggle row expansion with debug logs
  const toggleRow = (rowId) => {
    setExpandedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  const handleEdit = async (id, url) => {
    setToggleedit(true);
    setEditid({
      id: id,
      url: url,
    });
    // Implement edit functionality here
  };

  const handleDelete = (id) => {
    // Implement delete functionality here
  };
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:px-6">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs?.map((breadcrumb, index) => (
                <BreadcrumbItem key={index}>
                  {breadcrumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <img
                  src={userAvatar}
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
                  navigate("/");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <div className="relative ml-auto flex-1 md:grow-0">
                  {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                  <Input
                    type="search"
                    placeholder={searchPlaceholder}
                    value={Searchitem}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  />
                </div>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                      {
                        label: "Priority Card",
                        value: true,
                        checked: filterValue === true,
                      },
                    ].map((filter, index) => (
                      <DropdownMenuCheckboxItem
                        key={index}
                        checked={filter.checked}
                        onCheckedChange={() => onFilterChange(filter.value)} // Apply the filter when selected
                      >
                        {filter.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* <Button size="sm" className="h-8 gap-1" onClick={onAddProduct}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button> */}

                <AddItem typeofschema={typeofschema} add={tableData?.add} />
              </div>
            </div>
            <TabsContent value="all">
              <Card className="bg-accent/40">
                <CardHeader>
                  <CardTitle>{tableColumns.title}</CardTitle>
                  <CardDescription>{tableColumns.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableColumns?.headers?.map((header, index) => (
                          <TableHead
                            key={index}
                            className={
                              header.hiddenOn === "hidden" ? "hidden" : ""
                            }
                          >
                            {header.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData?.map((row) => (
                        <React.Fragment key={row._id}>
                          <TableRow>
                            {tableColumns?.headers?.map((header, index) => (
                              <TableCell
                                key={index}
                                className={
                                  header.hiddenOn ? header.hiddenOn : ""
                                }
                              >
                                {header.key === "one" ? (
                                  row.one
                                ) : header.key === "action" ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="center"
                                      className="w-full flex-col items-center flex justify-center"
                                    >
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <Edititem id={row?._id} />
                                      <DropdownMenuSeparator />

                                      <AlertDialogbox url={row?.delete} />
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : header.key === "two" ? (
                                  row.two
                                ) : header.key === "three" ? (
                                  row.three
                                ) : header.key === "four" ? (
                                  row.four
                                ) : header.key === "five" ? (
                                  row.five
                                ) : header.key === "six" ? (
                                  `₹${row.six}`
                                ) : (
                                  row[header.key]
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                    <TableFooter></TableFooter>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center w-full p-4 min-w-[20rem]">
                    <div>
                      <p>
                        Page {currentPage} of {totalPages} (Total items:{" "}
                        {totalPages})
                      </p>
                    </div>
                    <Pagination className="flex items-center">
                      <PaginationContent>
                        <PaginationItem onClick={handlePrevPage}>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        {/* Static page numbers can be replaced by dynamic mapping if needed */}
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(1)}>
                            {1}
                          </PaginationLink>
                        </PaginationItem>
                        {currentPage + 1 !== totalPages &&
                          currentPage !== totalPages && (
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(currentPage + 1)}
                              >
                                {currentPage + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        {currentPage + 1 === totalPages &&
                          currentPage === totalPages && (
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(totalPages - 1)}
                              >
                                {totalPages - 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem onClick={handleNextPage}>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

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
export const description =
  "A reusable registrations dashboard with customizable header and table. Configure breadcrumbs, search, tabs, and table data through props.";

export default function Dashboard({
  breadcrumbs = [],
  searchPlaceholder = "Search...",
  userAvatar = "/placeholder-user.jpg",
  tableColumns = {},

  typeofschema,
  tableData = [],
  onAddProduct = () => {},
  onExport = () => {},
  onFilterChange = () => {},
  onProductAction = () => {},
}) {
  console.log("This is inside the dashboard", tableData);
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
        console.log(`Collapsing row with _id: ${rowId}`);
        return prev.filter((id) => id !== rowId);
      } else {
        console.log(`Expanding row with _id: ${rowId}`);
        return [...prev, rowId];
      }
    });
  };

  const AddItem = () => <div>Add Item Placeholder</div>;
  const Edititem = () => <div>Edit Item Placeholder</div>;

  const handleEdit = async (id, url) => {
    console.log("Edit clicked");
    setToggleedit(true);
    setEditid({
      id: id,
      url: url,
    });
    // Implement edit functionality here
  };

  const handleDelete = (id) => {
    console.log("Delete clicked");
    // Implement delete functionality here
  };
  return (
    <div className="flex  w-full flex-col ">
      <div className="flex flex-col sm:gap-4">
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
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
                            className={header.hiddenOn ? header.hiddenOn : ""}
                          >
                            {header.label}
                          </TableHead>
                        ))}
                        {/* <TableHead>Services</TableHead> */}
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
                                        className="h-8 w-8"
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
                          {expandedRows.includes(row._id) && (
                            <></>
                            // <TableRow>
                            //   <TableCell
                            //     colSpan={tableColumns.headers.length + 1}
                            //   >
                            //     <div className="p-4 bg-muted rounded-md">
                            //       <h4 className="text-sm font-semibold mb-2">
                            //         Services
                            //       </h4>
                            //       {/* Nested Services Table */}
                            //       <Table className="mb-4">
                            //         <TableHeader>
                            //           <TableRow>
                            //             <TableHead>Service Name</TableHead>
                            //             <TableHead>Description</TableHead>
                            //             <TableHead>Price ($)</TableHead>
                            //             <TableHead>Urgent</TableHead>
                            //           </TableRow>
                            //         </TableHeader>
                            //         <TableBody>
                            //           {row?.services?.map((service) => (
                            //             <TableRow key={service._id}>
                            //               <TableCell>{service.name}</TableCell>
                            //               <TableCell>
                            //                 {service.description}
                            //               </TableCell>
                            //               <TableCell>
                            //                 &#x20b9;{service.price}
                            //               </TableCell>
                            //               <TableCell>
                            //                 {service.urgent}
                            //               </TableCell>
                            //             </TableRow>
                            //           ))}
                            //         </TableBody>
                            //         <TableFooter>
                            //           <TableRow>
                            //             <TableCell colSpan={2}>
                            //               <strong>Total</strong>
                            //             </TableCell>
                            //             <TableCell>
                            //               &#x20b9;{" "}
                            //               {row?.services
                            //                 ?.reduce(
                            //                   (total, service) =>
                            //                     total + service.price,
                            //                   0
                            //                 )
                            //                 .toFixed(2)}
                            //             </TableCell>
                            //           </TableRow>
                            //         </TableFooter>
                            //       </Table>
                            //     </div>
                            //   </TableCell>
                            // </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>{tableColumns?.pagination?.from}</strong>-
                    <strong>{tableColumns?.pagination?.to}</strong> of{" "}
                    <strong>{tableColumns?.pagination?.total}</strong>{" "}
                    registrations
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            {/* Add more TabsContent as needed */}
          </Tabs>
        </main>
      </div>
    </div>
  );
}

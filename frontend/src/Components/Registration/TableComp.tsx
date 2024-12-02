import React, { useEffect, useState } from "react";
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
  setcalculatedprice,
  typeofschema,
  tableData = [],
  setAddTestTable,
  AddTestTable,
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
  const [totalprice, setTotalprice] = useState(0);
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

  useEffect(() => {
    // Calculating total price
    const totalprice = AddTestTable?.map((item) =>
      Number(item.price || 0)
    ).reduce((a, b) => a + b, 0);
    setTotalprice(totalprice);
    setcalculatedprice(totalprice);
  }, [AddTestTable]);

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
                  <Table className="table-auto w-full border-collapse border border-gray-200">
                    <TableHeader>
                      <TableRow>
                        {tableColumns?.headers?.map((header, index) => (
                          <TableHead
                            key={index}
                            className={`text-right px-4 py-2 border border-gray-200 ${
                              header.hiddenOn || ""
                            }`}
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
                          {console.log("This is row", tableData)}
                          <TableRow>
                            {tableColumns?.headers?.map((header, index) => (
                              <TableCell
                                key={index}
                                className={`text-right px-4 py-2 border border-gray-200 ${
                                  header.hiddenOn || ""
                                }`}
                              >
                                {header.key === "one" ? (
                                  <Input value={row?.one || ""} disabled />
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
                                  <Input value={row?.two || ""} disabled />
                                ) : header.key === "three" ? (
                                  row.three
                                ) : header.key === "four" ? (
                                  row.four
                                ) : header.key === "five" ? (
                                  row.five
                                ) : header.key === "six" ? (
                                  <Input
                                    value={row.six || ""}
                                    onChange={(e) => {
                                      setAddTestTable((prev) =>
                                        prev.map((item) =>
                                          item._id === row._id
                                            ? {
                                                ...item,
                                                price: e.target.value, // Ensure you update the correct key
                                              }
                                            : item
                                        )
                                      );
                                    }}
                                  />
                                ) : (
                                  row[header.key]
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                        <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                        <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                        <TableCell className="text-left px-4 py-2 border border-gray-200 min-w-[10rem]"></TableCell>
                        <TableCell
                          colSpan={1}
                          className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]"
                        >
                          <strong>SubTotal</strong>
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          className="text-right px-4 py-2 border border-gray-200 min-w-[10rem]"
                        >
                          <strong>{totalprice}</strong>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

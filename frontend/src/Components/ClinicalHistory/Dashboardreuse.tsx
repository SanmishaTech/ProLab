import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Ellipsis,
  FileText,
  FileSymlink,
  Files,
  ChevronDown,
  PlusCircle,
  Filter,
  Download,
  X,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// UI Components
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
  Avatar,
  Tooltip,
  useDisclosure,
} from "@heroui/react";

// Components
import AlertDialogbox from "./AlertBox";
import Additem from "./Additem";
import Edititem from "./Edititem";

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
  data,
}) {
  const navigate = useNavigate();
  const [toggleedit, setToggleedit] = useState(false);
  const [editid, setEditid] = useState();
  const [toggledelete, setToggledelete] = useState();
  const [expandedRows, setExpandedRows] = useState([]);
  const [toggleopen, setToggleopen] = useState(false);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [handleopen, setHandleopen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(tableData);

  // Icon styles
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  // Open modal handler
  const handleOpen = () => onOpen();

  // Toggle row expansion
  const toggleRow = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Edit handler
  const handleEdit = (id) => {
    setEditid(id);
    handleOpen();
  };

  // Search functionality
  useEffect(() => {
    if (!tableData) return;

    const filtered = tableData.filter((row) => {
      return Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, tableData]);

  // Data refresh handler
  const refetchData = async () => {
    try {
      const response = await axios.get(`/api/department/alldepartment`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background/30">
      <div className="flex flex-col gap-6 py-6 px-8">
        {/* Header with breadcrumbs and search */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs?.map((breadcrumb, index) => (
                <BreadcrumbItem key={index}>
                  {breadcrumb.href ? (
                    <BreadcrumbLink asChild>
                      <Link
                        to={breadcrumb.href}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {breadcrumb.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="w-full rounded-full bg-background pl-10 border-muted focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Dropdown>
              <DropdownTrigger asChild>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:scale-105"
                  src={userAvatar}
                />
              </DropdownTrigger>
              <DropdownMenu align="end" className="w-56">
                <DropdownSection title="User Settings">
                  <DropdownItem key="account">My Account</DropdownItem>
                  <DropdownItem key="setting">Settings</DropdownItem>
                  <DropdownItem key="support">Support</DropdownItem>
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem
                    key="logout"
                    className="text-danger"
                    color="danger"
                    onPress={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      navigate("/");
                    }}
                  >
                    Logout
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* Main content */}
        <main className="grid flex-1 items-start gap-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {tableColumns.title || "Dashboard"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {tableColumns.description || "Manage your data efficiently"}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end">
                <Button
                  color="default"
                  variant="flat"
                  startContent={<Filter size={16} />}
                  className="h-9"
                >
                  Filter
                </Button>

                <Button
                  color="default"
                  variant="flat"
                  startContent={<Download size={16} />}
                  className="h-9"
                >
                  Export
                </Button>

                <Button
                  color="primary"
                  variant="solid"
                  startContent={<PlusCircle size={16} />}
                  onPress={() => setHandleopen(true)}
                  className="h-9"
                >
                  Add New
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <Edititem
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                onOpenChange={onOpenChange}
                editid={editid}
                typeofschema={typeofschema}
              />

              <AlertDialogbox
                backdrop="blur"
                url={editid}
                isOpen={toggleopen}
                onOpen={setToggleopen}
              />

              <Additem
                typeofschema={typeofschema}
                add={tableData?.add}
                onAddProduct={onAddProduct}
                setHandleopen={setHandleopen}
                handleopen={handleopen}
              />

              {!tableData || tableData.length <= 0 ? (
                <EmptyState
                  className="bg-accent/20 border border-border rounded-lg shadow-sm w-full min-h-[500px] justify-center items-center"
                  title="No Data Available"
                  description="You can create a new form to add to your pages."
                  icons={[FileText, FileSymlink, Files]}
                  Item={AddItem}
                  typeofschema={typeofschema}
                />
              ) : (
                <Card className="bg-card border border-border shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            {tableColumns?.headers?.map((header, index) => (
                              <TableHead
                                key={index}
                                className={cn(
                                  "text-xs font-medium text-muted-foreground py-3",
                                  header.hiddenOn
                                )}
                              >
                                <div className="flex items-center gap-1">
                                  {header.label}
                                  {header.sortable && (
                                    <ChevronDown
                                      size={14}
                                      className="text-muted-foreground/70"
                                    />
                                  )}
                                </div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {filteredData?.map((row, rowIndex) => (
                            <TableRow
                              key={row._id || rowIndex}
                              className="group border-b hover:bg-muted/20 transition-colors"
                            >
                              {tableColumns?.headers?.map(
                                (header, cellIndex) => (
                                  <TableCell
                                    key={cellIndex}
                                    className={cn(
                                      "py-3 text-sm font-normal",
                                      header.hiddenOn,
                                      header.key === "action" ? "w-14" : ""
                                    )}
                                  >
                                    {header.key === "one" ? (
                                      <div className="font-medium">
                                        {row.one}
                                      </div>
                                    ) : header.key === "action" ? (
                                      <Dropdown backdrop="blur" showArrow>
                                        <DropdownTrigger>
                                          <button className="p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
                                            <Ellipsis className="w-5 h-5 text-muted-foreground" />
                                          </button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                          aria-label="Actions"
                                          variant="faded"
                                          className="w-56"
                                        >
                                          <DropdownSection title="Actions">
                                            <DropdownItem
                                              key="edit"
                                              description="Edit this item"
                                              onPress={() =>
                                                handleEdit(row?._id)
                                              }
                                              startContent={
                                                <EditDocumentIcon
                                                  className={iconClasses}
                                                />
                                              }
                                            >
                                              Edit
                                            </DropdownItem>
                                          </DropdownSection>
                                          <DropdownSection title="Danger zone">
                                            <DropdownItem
                                              key="delete"
                                              className="text-danger"
                                              color="danger"
                                              description="This action cannot be undone"
                                              onPress={() => {
                                                setEditid(row?._id);
                                                setToggleopen(true);
                                              }}
                                              startContent={
                                                <DeleteDocumentIcon
                                                  className={cn(
                                                    iconClasses,
                                                    "text-danger"
                                                  )}
                                                />
                                              }
                                            >
                                              Delete
                                            </DropdownItem>
                                          </DropdownSection>
                                        </DropdownMenu>
                                      </Dropdown>
                                    ) : header.key === "status" ? (
                                      <Badge
                                        variant={
                                          row.status === "active"
                                            ? "success"
                                            : "secondary"
                                        }
                                        className="capitalize"
                                      >
                                        {row[header.key]}
                                      </Badge>
                                    ) : header.key === "six" ? (
                                      <span className="font-medium text-primary">
                                        ₹{row.six}
                                      </span>
                                    ) : (
                                      row[header.key]
                                    )}
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                      {tableData && (
                        <>
                          Showing{" "}
                          <strong>
                            {Math.min(
                              tableData.length,
                              tableColumns?.pagination?.from || 1
                            )}
                          </strong>
                          -
                          <strong>
                            {Math.min(
                              tableData.length,
                              tableColumns?.pagination?.to || tableData.length
                            )}
                          </strong>{" "}
                          of <strong>{tableData.length}</strong> items
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="flat" isDisabled={true}>
                        Previous
                      </Button>
                      <Button size="sm" variant="flat" isDisabled={true}>
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

// Icon components
export const EditDocumentIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52v7.95C2 19.94 4.07 22 7.52 22h7.95c3.46 0 5.52-2.06 5.52-5.52V8.52C21 5.06 18.93 3 15.48 3Z"
      fill="currentColor"
      opacity={0.4}
    />
    <path
      d="M21.02 2.98c-1.79-1.8-3.54-1.84-5.38 0L14.51 4.1c-.1.1-.13.24-.09.37.7 2.45 2.66 4.41 5.11 5.11.03.01.08.01.11.01.1 0 .2-.04.27-.11l1.11-1.12c.91-.91 1.36-1.78 1.36-2.67 0-.9-.45-1.79-1.36-2.71ZM17.86 10.42c-.27-.13-.53-.26-.77-.41-.2-.12-.4-.25-.59-.39-.16-.1-.34-.25-.52-.4-.02-.01-.08-.06-.16-.14-.31-.25-.64-.59-.95-.96-.02-.02-.08-.08-.13-.17-.1-.11-.25-.3-.38-.51-.11-.14-.24-.34-.36-.55-.15-.25-.28-.5-.4-.76-.13-.28-.23-.54-.32-.79L7.9 10.72c-.35.35-.69 1.01-.76 1.5l-.43 2.98c-.09.63.08 1.22.47 1.61.33.33.78.5 1.28.5.11 0 .22-.01.33-.02l2.97-.42c.49-.07 1.15-.4 1.5-.76l5.38-5.38c-.25-.08-.5-.19-.78-.31Z"
      fill="currentColor"
    />
  </svg>
);

export const DeleteDocumentIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21.07 5.23c-1.61-.16-3.22-.28-4.84-.37v-.01l-.22-1.3c-.15-.92-.37-2.3-2.71-2.3h-2.62c-2.33 0-2.55 1.32-2.71 2.29l-.21 1.28c-.93.06-1.86.12-2.79.21l-2.04.2c-.42.04-.72.41-.68.82.04.41.4.71.82.67l2.04-.2c5.24-.52 10.52-.32 15.82.21h.08c.38 0 .71-.29.75-.68a.766.766 0 0 0-.69-.82Z"
      fill="currentColor"
    />
    <path
      d="M19.23 8.14c-.24-.25-.57-.39-.91-.39H5.68c-.34 0-.68.14-.91.39-.23.25-.36.59-.34.94l.62 10.26c.11 1.52.25 3.42 3.74 3.42h6.42c3.49 0 3.63-1.89 3.74-3.42l.62-10.25c.02-.36-.11-.7-.34-.95Z"
      fill="currentColor"
      opacity={0.399}
    />
    <path
      clipRule="evenodd"
      d="M9.58 17a.75.75 0 0 1 .75-.75h3.33a.75.75 0 0 1 0 1.5h-3.33a.75.75 0 0 1-.75-.75ZM8.75 13a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

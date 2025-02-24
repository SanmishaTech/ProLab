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
import { Ellipsis } from "lucide-react";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  // Button,
} from "@heroui/react";
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
import Edititem from "./Edititem";
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
  const [toggleopen, setToggleopen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const handleOpen = () => {
    // setBackdrop(backdrop);
    onOpen();
  };

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

  const handleEdit = async (id, url) => {
    console.log("Edit clicked");
    setToggleedit(true);
    setEditid({
      id: id,
      url: url,
    });
    // Implement edit functionality here
  };

  useEffect(() => {
    console.log("isopen", isOpen);
  }, [isOpen]);

  const handleDelete = (id) => {
    console.log("Delete clicked");
    // Implement delete functionality here
  };

  const refetchdata = async () => {
    await axios
      .get(`/api/department/alldepartment`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
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
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <Dropdown>
            <DropdownTrigger asChild>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src={userAvatar}
              />
            </DropdownTrigger>
            <DropdownMenu align="end">
              <DropdownItem key="account"> My Account</DropdownItem>
              <DropdownItem key="setting">Settings</DropdownItem>
              <DropdownItem key="support">Support</DropdownItem>
              <DropdownItem
                key="logout"
                onPress={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/");
                }}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList className="bg-accent/60">
                {tableColumns?.tabs?.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <AddItem typeofschema={typeofschema} add={tableData?.add} />
                <AlertDialogbox
                  backdrop="blur"
                  url={editid}
                  isOpen={toggleopen}
                  onOpen={setToggleopen}
                />
              </div>
            </div>
            <TabsContent value="all">
              <Edititem
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                editid={editid}
                typeofschema={typeofschema}
              />
              {tableData?.length <= 0 ? (
                <EmptyState
                  className="bg-accent/40 w-full min-h-[500px] justify-center items-center"
                  title="No Forms Created"
                  description="You can create a new Form to add in your pages."
                  icons={[FileText, FileSymlink, Files]}
                  Item={AddItem}
                  typeofschema={typeofschema}
                  // action={{
                  //   label: "Create Form",
                  //   onClick: () => {
                  //     console.log("Create form clicked");
                  //   },
                  // }}
                />
              ) : (
                <Card className="bg-accent/40">
                  <CardHeader>
                    <CardTitle>{tableColumns.title}</CardTitle>
                    <CardDescription>
                      {tableColumns.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableColumns?.headers?.map((header, index) => (
                            <>
                              <TableHead
                                key={index}
                                className={
                                  header.hiddenOn ? header.hiddenOn : ""
                                }
                              >
                                {header.label}
                              </TableHead>
                            </>
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
                                    <Dropdown
                                      backdrop="blur"
                                      showArrow
                                      classNames={{
                                        base: "before:bg-default-200", // change arrow background
                                        content:
                                          "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                                      }}
                                    >
                                      <DropdownTrigger>
                                        {/* <Button variant="bordered">
                                          Open Menu
                                        </Button> */}
                                        <Ellipsis className="w-7 h-7 text-muted-foreground hover:text-foreground hover:bg-muted" />
                                      </DropdownTrigger>
                                      <DropdownMenu
                                        aria-label="Dropdown menu with description"
                                        variant="faded"
                                      >
                                        <DropdownSection title="Actions">
                                          <DropdownItem
                                            key="edit"
                                            description="Allows you to edit the file"
                                            onPress={() => {
                                              setEditid(row?._id);
                                              handleOpen();
                                            }}
                                            startContent={
                                              <EditDocumentIcon
                                                className={iconClasses}
                                              />
                                            }
                                          >
                                            Edit file
                                          </DropdownItem>
                                        </DropdownSection>
                                        <DropdownSection title="Danger zone">
                                          <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                            description="Permanently delete the file"
                                            onPress={() => {
                                              setEditid(row?._id);

                                              setToggleopen(!toggleopen);
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
                                            Delete file
                                          </DropdownItem>
                                        </DropdownSection>
                                      </DropdownMenu>
                                    </Dropdown>
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

                              {/* <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRow(row._id)}
                                aria-expanded={expandedRows.includes(row._id)}
                                aria-controls={`services-${row._id}`}
                              >
                                {expandedRows.includes(row._id)
                                  ? "Hide"
                                  : "Show"}{" "}
                                Services
                              </Button>
                            </TableCell> */}
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>

                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>{tableColumns.pagination.from}</strong>-
                      <strong>{tableColumns.pagination.to}</strong> of{" "}
                      <strong>{tableColumns.pagination.total}</strong>{" "}
                      registrations
                    </div>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            {/* Add more TabsContent as needed */}
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export const AddNoteIcon = (props) => {
  return (
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
        d="M7.37 22h9.25a4.87 4.87 0 0 0 4.87-4.87V8.37a4.87 4.87 0 0 0-4.87-4.87H7.37A4.87 4.87 0 0 0 2.5 8.37v8.75c0 2.7 2.18 4.88 4.87 4.88Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M8.29 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM15.71 6.29c-.42 0-.75-.34-.75-.75V2.75a.749.749 0 1 1 1.5 0v2.78c0 .42-.33.76-.75.76ZM12 14.75h-1.69V13c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.75H7c-.41 0-.75.34-.75.75s.34.75.75.75h1.81V18c0 .41.34.75.75.75s.75-.34.75-.75v-1.75H12c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const CopyDocumentIcon = (props) => {
  return (
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
        d="M15.5 13.15h-2.17c-1.78 0-3.23-1.44-3.23-3.23V7.75c0-.41-.33-.75-.75-.75H6.18C3.87 7 2 8.5 2 11.18v6.64C2 20.5 3.87 22 6.18 22h5.89c2.31 0 4.18-1.5 4.18-4.18V13.9c0-.42-.34-.75-.75-.75Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M17.82 2H11.93C9.67 2 7.84 3.44 7.76 6.01c.06 0 .11-.01.17-.01h5.89C16.13 6 18 7.5 18 10.18V16.83c0 .06-.01.11-.01.16 2.23-.07 4.01-1.55 4.01-4.16V6.18C22 3.5 20.13 2 17.82 2Z"
        fill="currentColor"
      />
      <path
        d="M11.98 7.15c-.31-.31-.84-.1-.84.33v2.62c0 1.1.93 2 2.07 2 .71.01 1.7.01 2.55.01.43 0 .65-.5.35-.8-1.09-1.09-3.03-3.04-4.13-4.16Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EditDocumentIcon = (props) => {
  return (
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
};

export const DeleteDocumentIcon = (props) => {
  return (
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
};

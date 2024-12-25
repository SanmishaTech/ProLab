import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  File,
  PlusCircle,
  Search,
  MoreHorizontal,
  ListFilter,
} from "lucide-react";
import { DateRangePicker } from "@nextui-org/date-picker";
import type { DateValue, RangeValue } from "react-aria";

import { Badge } from "@/components/ui/badge";
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

interface Test {
  _id: string;
  name: string;
  description: string;
  urgent: string;
  price: number;
}

interface TableData {
  _id: string;
  patientName: string;
  patientAge: number;
  dueDate: string;
  createdAt: string;
  gender: string;
  phone: string;
  referralName: string;
  paymentMode: number;
  Tests: Test[];
}

interface TableColumn {
  key: string;
  label: string;
  hiddenOn?: string;
}

interface DateRange {
  startDate: DateValue | null;
  endDate: DateValue | null;
}

interface DashboardProps {
  breadcrumbs?: Array<{
    href?: string;
    label: string;
  }>;
  searchPlaceholder?: string;
  userAvatar?: string;
  tableColumns: {
    title?: string;
    description?: string;
    headers: TableColumn[];
    filters?: Array<{
      label: string;
      value: string;
      checked: boolean;
    }>;
    pagination: {
      from: number;
      to: number;
      total: number;
    };
  };
  tableData: TableData[];
  onAddProduct?: () => void;
  onExport?: () => void;
  onFilterChange?: (value: string) => void;
  onProductAction?: () => void;
}

export default function Dashboard({
  breadcrumbs = [],
  searchPlaceholder = "Search patient name...",
  userAvatar = "/placeholder-user.jpg",
  tableColumns,
  tableData = [],
  onAddProduct = () => {},
  onExport = () => {},
  onFilterChange = () => {},
  onProductAction = () => {},
}: DashboardProps) {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>(tableData);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  React.useEffect(() => {
    let filtered = [...tableData];

    // Apply name search filter
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date range filter based on createdAt
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((row) => {
        console.log("ROw, ", row);
        if (!row.createdAt) return true; // Skip filtering if createdAt is not available
        const rowDate = new Date(row.createdAt);
        const startDate = new Date(dateRange.startDate.toString());
        const endDate = new Date(dateRange.endDate.toString());
        // Set the time to start of day for start date and end of day for end date
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return rowDate >= startDate && rowDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [searchQuery, dateRange, tableData]);

  const handleDateRangeChange = (value: RangeValue<DateValue> | null) => {
    if (!value) {
      setDateRange({ startDate: null, endDate: null });
      return;
    }

    setDateRange({
      startDate: value.start,
      endDate: value.end,
    });
  };

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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

        {/* Main Content */}
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-4">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList className="bg-accent/60 pb-2 drop-shadow-none">
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 pb-2 drop-shadow-none">
                  <DateRangePicker
                    visibleMonths={2}
                    variant="underlined"
                    label="Date Range"
                    className="w-full bg-white drop-shadow-none"
                    onChange={handleDateRangeChange}
                    value={
                      dateRange.startDate && dateRange.endDate
                        ? {
                            start: dateRange.startDate,
                            end: dateRange.endDate,
                          }
                        : null
                    }
                  />
                </div>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                {filteredData.length !== tableData.length && (
                  <Badge variant="secondary">
                    Showing {filteredData.length} of {tableData.length} records
                  </Badge>
                )}
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
                    {tableColumns?.filters?.map((filter, index) => (
                      <DropdownMenuCheckboxItem
                        key={index}
                        checked={filter.checked}
                        onCheckedChange={() => onFilterChange(filter.value)}
                      >
                        {filter.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                            className={header.hiddenOn ? header.hiddenOn : ""}
                          >
                            {header.label}
                          </TableHead>
                        ))}
                        <TableHead>Tests</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((row: TableData) => (
                        <React.Fragment key={row._id}>
                          <TableRow>
                            {tableColumns.headers.map((header, index) => {
                              const getCellContent = (): string => {
                                const value =
                                  row[header.key as keyof TableData];
                                switch (header.key) {
                                  case "patientName":
                                    return row.patientName;
                                  case "dueDate":
                                    return row.dueDate;
                                  case "patientAge":
                                    return row.patientAge.toString();
                                  case "gender":
                                    return row.gender;
                                  case "phone":
                                    return row.phone;
                                  case "referralName":
                                    return row.referralName;
                                  case "paymentMode":
                                    return `₹${row.paymentMode}`;
                                  default:
                                    return typeof value === "string" ||
                                      typeof value === "number"
                                      ? value.toString()
                                      : "";
                                }
                              };

                              return (
                                <TableCell
                                  key={index}
                                  className={header.hiddenOn ?? ""}
                                >
                                  {getCellContent()}
                                </TableCell>
                              );
                            })}
                            <TableCell>
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
                                Tests
                              </Button>
                            </TableCell>
                          </TableRow>
                          {expandedRows.includes(row._id) && (
                            <TableRow>
                              <TableCell
                                colSpan={tableColumns.headers.length + 1}
                              >
                                <div className="p-4 bg-muted rounded-md">
                                  <h4 className="text-sm font-semibold mb-2 ml-3">
                                    Tests
                                  </h4>
                                  <Table className="mb-4">
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Service Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Urgent</TableHead>
                                        <TableHead>Price (₹)</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {row.Tests?.map((service: Test) => (
                                        <TableRow key={service._id}>
                                          <TableCell>{service.name}</TableCell>
                                          <TableCell>
                                            {service.description}
                                          </TableCell>
                                          <TableCell>
                                            {service.urgent}
                                          </TableCell>
                                          <TableCell>
                                            ₹{service.price}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                    <TableFooter>
                                      <TableRow>
                                        <TableCell colSpan={3}>
                                          <strong>Total</strong>
                                        </TableCell>
                                        <TableCell>
                                          ₹{" "}
                                          {row.Tests?.reduce(
                                            (total: number, service: Test) =>
                                              total + service.price,
                                            0
                                          ).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    </TableFooter>
                                  </Table>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
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
            </TabsContent>
            {/* Add more TabsContent as needed */}
          </Tabs>
        </main>
      </div>
    </div>
  );
}

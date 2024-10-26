"use client";

import { Link } from "react-router-dom";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PanelLeft } from "lucide-react";
import { Package2, Home, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for charts
const chartData = [
  { name: "Jan", total: 1000 },
  { name: "Feb", total: 1200 },
  { name: "Mar", total: 900 },
  { name: "Apr", total: 1500 },
  { name: "May", total: 1800 },
  { name: "Jun", total: 2000 },
];

const userActivityData = [
  { name: "Mon", active: 200 },
  { name: "Tue", active: 350 },
  { name: "Wed", active: 400 },
  { name: "Thu", active: 450 },
  { name: "Fri", active: 500 },
  { name: "Sat", active: 300 },
  { name: "Sun", active: 200 },
];
const totaldata = [
  { name: "Jan", userTotal: 1000, active: 200 },
  { name: "Feb", userTotal: 1200, active: 350 },
  { name: "Mar", userTotal: 900, active: 400 },
  { name: "Apr", userTotal: 1500, active: 450 },
  { name: "May", userTotal: 1800, active: 500 },
  { name: "Jun", userTotal: 2000, active: 300 },
];

const chartConfig = {
  userTotal: {
    label: "UserTotal",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Dashboardcomponent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
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
        <Link
          to="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Activity className="h-6 w-6 ml-2" />
          <span className="max-sm:text-sm">Analytics Dashboard</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">My Account</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card>
            <CardHeader>
              <CardTitle>Bar Chart - Multiple</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                  />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Daily active users over the last week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  active: {
                    label: "Active Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userActivityData}>
                    <Line
                      type="monotone"
                      dataKey="active"
                      stroke="var(--color-active)"
                      strokeWidth={2}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your most recent sales and refunds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
                <div className="flex items-center">
                  <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                    <AvatarImage src="/avatars/02.png" alt="Avatar" />
                    <AvatarFallback>JL</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Jackson Lee
                    </p>
                    <p className="text-sm text-muted-foreground">
                      jackson.lee@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$39.00</div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/03.png" alt="Avatar" />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Isabella Nguyen
                    </p>
                    <p className="text-sm text-muted-foreground">
                      isabella.nguyen@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$299.00</div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/04.png" alt="Avatar" />
                    <AvatarFallback>WK</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      William Kim
                    </p>
                    <p className="text-sm text-muted-foreground">
                      will@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$99.00</div>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/05.png" alt="Avatar" />
                    <AvatarFallback>SD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Sofia Davis
                    </p>
                    <p className="text-sm text-muted-foreground">
                      sofia.davis@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-red-500">
                    -$39.00
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Downloads</CardTitle>
              <CardDescription>
                Your most recent file downloads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      report-2023.pdf
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Downloaded 2 hours ago
                    </p>
                  </div>
                  <div className="ml-auto font-medium">2.4 MB</div>
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      invoice-0073.pdf
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Downloaded 4 hours ago
                    </p>
                  </div>
                  <div className="ml-auto font-medium">1.2 MB</div>
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      presentation.pptx
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Downloaded yesterday
                    </p>
                  </div>
                  <div className="ml-auto font-medium">5.7 MB</div>
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      contract.docx
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Downloaded 2 days ago
                    </p>
                  </div>
                  <div className="ml-auto font-medium">0.8 MB</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Bell,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import userAvatar from "@/images/Profile.jpg";
const recentTests = [
  {
    id: "T001",
    patientName: "John Doe",
    test: "Blood Panel",
    status: "Completed",
    result: "Normal",
  },
  {
    id: "T002",
    patientName: "Jane Smith",
    test: "Urinalysis",
    status: "Completed",
    result: "Abnormal",
  },
  {
    id: "T003",
    patientName: "Bob Johnson",
    test: "Lipid Panel",
    status: "In Progress",
    result: "Pending",
  },
  {
    id: "T004",
    patientName: "Alice Brown",
    test: "Thyroid Function",
    status: "Completed",
    result: "Normal",
  },
  {
    id: "T005",
    patientName: "Charlie Davis",
    test: "Liver Function",
    status: "Completed",
    result: "Abnormal",
  },
];

const pendingTests = [
  {
    id: "T006",
    patientName: "Eva White",
    test: "Complete Blood Count",
    priority: "High",
  },
  {
    id: "T007",
    patientName: "Frank Miller",
    test: "Metabolic Panel",
    priority: "Medium",
  },
  {
    id: "T008",
    patientName: "Grace Taylor",
    test: "Hemoglobin A1C",
    priority: "Low",
  },
  {
    id: "T009",
    patientName: "Henry Wilson",
    test: "Vitamin D",
    priority: "Medium",
  },
  {
    id: "T010",
    patientName: "Ivy Moore",
    test: "Iron Panel",
    priority: "High",
  },
];

const testVolumeData = [
  { name: "Jan", tests: 165 },
  { name: "Feb", tests: 180 },
  { name: "Mar", tests: 200 },
  { name: "Apr", tests: 220 },
  { name: "May", tests: 195 },
  { name: "Jun", tests: 210 },
];

export default function ResponsiveLabDashboard() {
  const [countRegister, setCountRegister] = useState(0);
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/registration/allregistration`);
      console.log(response.data);
      setCountRegister(response.data.length);
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen ">
      {/* Sidebar for larger screens */}
      {/* <Sidebar className="hidden md:block w-64 shadow-md" /> */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold ">Lab Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
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
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                {/* <Sidebar /> */}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-accent/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Registered
              </CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />{" "}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {countRegister && countRegister}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Tests
              </CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" />{" "}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Abnormal Results
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16.8%</div>
            </CardContent>
          </Card>
          <Card className="bg-accent/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lab Efficiency
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92.6%</div>
              <p className="text-xs text-muted-foreground">
                +1.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4 ">
          <Card className="col-span-full lg:col-span-4 overflow-x-auto bg-accent/40">
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Test ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.patientName}</TableCell>
                      <TableCell>{test.test}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            test.status === "Completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            test.result === "Normal"
                              ? "success"
                              : test.result === "Abnormal"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {test.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-3 overflow-x-auto bg-accent/40">
            <CardHeader>
              <CardTitle>Pending Tests</CardTitle>
              <CardDescription>Tests awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTests.map((test) => (
                  <div key={test.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {test.patientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {test.test}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Badge
                        variant={
                          test.priority === "High"
                            ? "destructive"
                            : test.priority === "Medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {test.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-full lg:col-span-4 bg-accent/40">
            <CardHeader>
              <CardTitle>Test Volume Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={testVolumeData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Bar dataKey="tests" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-3 bg-accent/40">
            <CardHeader>
              <CardTitle>Lab Statistics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium">Test Accuracy</div>
                    <div className="text-sm text-muted-foreground">98.2%</div>
                  </div>
                  <div>+0.2%</div>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium">Turnaround Time</div>
                    <div className="text-sm text-muted-foreground">
                      24.5 hours
                    </div>
                  </div>
                  <div>-1.5h</div>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Equipment Utilization
                    </div>
                    <div className="text-sm text-muted-foreground">87.3%</div>
                  </div>
                  <div>+3.7%</div>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

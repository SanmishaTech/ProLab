import { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { ComboboxDemo } from "./ComboboxDemo";
import ApiDrivenInputWithSuggestions from "./Autocompletecomp";
import { toast } from "sonner";
import Datepicker from "@/utilityfunctions/Datepicker";

export default function PatientCard({ setTopComp }) {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [newReferral, setNewReferral] = useState("");
  const [selectedRefferal, setSelectedRefferal] = useState();
  const [selectedPatient, setSelectedPatient] = useState();
  const [date, setDate] = useState(new Date());

  const [patientForm, setPatientForm] = useState({
    userId: "",
    name: "",
    age: "",
    phone: "",
    gender: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    phone: "",
    gender: "",
  });

  // Validation Functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required.";
    } else if (name.trim().length < 2) {
      return "Name must be at least 2 characters long.";
    }
    return "";
  };

  const validateAge = (age) => {
    if (!age) {
      return "Age is required.";
    } else if (!Number.isInteger(Number(age)) || Number(age) <= 0) {
      return "Age must be a positive integer.";
    } else if (Number(age) > 120) {
      return "Please enter a valid age.";
    }
    return "";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Simple regex for 10-digit numbers
    if (!phone.trim()) {
      return "Phone number is required.";
    } else if (!phoneRegex.test(phone)) {
      return "Phone number must be a valid 10-digit number.";
    }
    return "";
  };

  const validateGender = (gender) => {
    if (!gender) {
      return "Gender is required.";
    }
    return "";
  };

  // Fetch Patients Based on Search Term
  useEffect(() => {
    const search = async () => {
      if (searchTerm.length < 1) {
        return;
      }
      try {
        const response = await axios.get(`/api/patients/search/${searchTerm}`);
        console.log(response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to fetch patients.");
      }
    };
    search();
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement actual search logic here

    console.log("Searching for:", searchTerm);
  };

  // Fetch Referrals
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axios.get(
          `/api/reference/allReference/${User?._id}`
        );
        console.log(response.data);
        setReferrals(response.data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        toast.error("Failed to fetch referrals.");
      }
    };
    fetchReferrals();
  }, [User?._id]);

  // Handle Form Changes with Validation
  const handlePatientFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setPatientForm({ ...patientForm, [id]: value });

    // Validate the specific field
    let error = "";
    switch (id) {
      case "name":
        error = validateName(value);
        break;
      case "age":
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "gender":
        error = validateGender(value);
        break;
      default:
        break;
    }
    setErrors({ ...errors, [id]: error });
  };

  // Validate Entire Form
  const validateForm = () => {
    const nameError = validateName(patientForm.name);
    const ageError = validateAge(patientForm.age);
    const phoneError = validatePhone(patientForm.phone);
    const genderError = validateGender(patientForm.gender);

    setErrors({
      name: nameError,
      age: ageError,
      phone: phoneError,
      gender: genderError,
    });

    return !(nameError || phoneError || genderError);
  };

  // Handle Adding a New Patient
  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    // Implement actual patient addition logic here
    console.log("Adding new patient:", patientForm);
    const requestSend = {
      name: patientForm?.name,
      age: date,
      phone: patientForm?.phone,
      gender: patientForm?.gender,
      userId: User?._id,
    };

    try {
      const response = await axios.post("/api/patients", requestSend);
      toast.success("Patient Added Successfully");
      setPatients([...patients, response.data]);
      setErrors({ name: "", age: "", phone: "", gender: "" });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient. Please try again.");
    }
  };

  // Handle Adding a New Referral
  const handleAddReferral = async () => {
    if (newReferral && !referrals.some((ref) => ref.name === newReferral)) {
      try {
        const response = await axios.post("/api/reference", {
          name: newReferral,
          userId: User?._id,
        });
        console.log(response.data);
        setReferrals([...referrals, response?.data?.reference]);
        setSelectedRefferal(response?.data?.reference?.name);
        setNewReferral("");
        toast.success("Referral Added Successfully");
      } catch (error) {
        console.error("Error adding referral:", error);
        toast.error("Failed to add referral. Please try again.");
      }
    } else if (referrals.some((ref) => ref.name === newReferral)) {
      toast.error("Referral already exists.");
    }
  };

  // Update Top Component with Selected Referral and Patient
  useEffect(() => {
    console.log("Selected Refferal", referrals, selectedRefferal);
    const selectedRefferalid = referrals.find(
      (refferal) => refferal?.name === selectedRefferal
    );
    const Component = {
      referral: selectedRefferalid?._id,
      patientId: patientForm?._id,
    };
    console.log("Selected Things", Component);
    setTopComp(Component);
  }, [selectedRefferal, patientForm, referrals, setTopComp]);

  return (
    <div className="flex space-x-4 w-full max-w-6xl ">
      {/* Patient Information Card */}
      <Card className="flex-1 bg-accent/40 shadow-md">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Search and add patient details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <ApiDrivenInputWithSuggestions setPatientForm={setPatientForm} />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>

            {/* Add Patient Form */}
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Patient's name"
                    value={patientForm.name}
                    onChange={handlePatientFormChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                  )}
                </div>

                {/* Age Field */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  {console.log(
                    "date",
                    new Date(patientForm?.age)?.toLocaleDateString()
                  )}
                  <Datepicker
                    placeholder="Patient's age"
                    value={patientForm?.age}
                    onChange={setDate}
                    className=""
                    defaultValues={new Date(
                      patientForm?.age
                    )?.toLocaleDateString()}
                  />
                  {errors.age && (
                    <span className="text-red-500 text-sm">{errors.age}</span>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={patientForm.phone}
                    onChange={handlePatientFormChange}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">{errors.phone}</span>
                  )}
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={patientForm.gender}
                    onValueChange={(value) => {
                      setPatientForm({ ...patientForm, gender: value });
                      const genderError = validateGender(value);
                      setErrors({ ...errors, gender: genderError });
                    }}
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="others">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <span className="text-red-500 text-sm">
                      {errors.gender}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  !patientForm.name ||
                  !patientForm.phone ||
                  !patientForm.gender ||
                  Object.values(errors).some((error) => error)
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Save Patient
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Referral Information Card */}
      <Card className="flex-1 bg-accent/40 shadow-md">
        <CardHeader>
          <CardTitle>Referral Information</CardTitle>
          <CardDescription>Add referral information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Select Referral */}
            <div className="space-y-2">
              <Label htmlFor="referral">Referred By</Label>
              <Select
                value={selectedRefferal}
                onValueChange={(value) => {
                  console.log("Value", value);
                  setSelectedRefferal(value);
                }}
              >
                <SelectTrigger id="referral">
                  <SelectValue placeholder="Select referral" />
                </SelectTrigger>
                <SelectContent>
                  {referrals?.map((referral, index) => (
                    <SelectItem key={index} value={referral?.name}>
                      {referral?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add New Referral */}
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="New referral name"
                value={newReferral}
                onChange={(e) => setNewReferral(e.target.value)}
              />
              <Button onClick={handleAddReferral}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

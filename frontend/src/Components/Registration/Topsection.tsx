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
import { SmartDatetimeInput } from "@/utilityfunctions/Datepicker";
import { DateTimePicker, TimePicker } from "@/components/ui/dateTimepicker";
import { useNavigate } from "react-router-dom";

export default function PatientCard({ setTopComp }) {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [referrals, setReferrals] = useState({
    primaryRefferedBy: "",
    secondaryRefferedBy: "",
    billedTo: "",
    corporateCustomer: "",
    clinicHistory: "",
    medicationHistory: "",
  });
  const [newReferral, setNewReferral] = useState("");
  const [selectedRefferal, setSelectedRefferal] = useState("");
  const [selectedPatient, setSelectedPatient] = useState();
  const [cooperateCustomer, setCooperateCustomer] = useState();
  const [date, setDate] = useState(new Date());
  const [associates, setAssociates] = useState([]);
  const navigate = useNavigate();
  const [patientForm, setPatientForm] = useState({
    userId: "",
    firstName: "",
    age: "",
    salutation: "",
    gender: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    age: "",
    salutation: "",
    gender: "",
  });

  // Validation Functions
  const validateName = (firstName) => {
    if (!firstName.trim()) {
      return "Name is required.";
    } else if (firstName.trim().length < 2) {
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

  const validatePhone = (salutation) => {
    const phoneRegex = /^[0-9]{10}$/; // Simple regex for 10-digit numbers
    if (!salutation.trim()) {
      return "Phone number is required.";
    } else if (!phoneRegex.test(salutation)) {
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
        const response = await axios.get(
          `/api/patientmaster/search/${searchTerm}`
        );
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
        // setReferrals(response.data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        toast.error("Failed to fetch referrals.");
      }
    };
    const fetchCooperateCustomer = async () => {
      try {
        const response = await axios.get(
          `/api/corporatemaster/allcorporates/${User?._id}`
        );
        console.log(response.data);
        setCooperateCustomer(response.data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        toast.error("Failed to fetch referrals.");
      }
    };

    fetchReferrals();
    fetchCooperateCustomer();
  }, [User?._id]);

  const handleReferralChange = (id: string, value: string) => {
    setReferrals({ ...referrals, [id]: value });
  };

  // Handle Form Changes with Validation
  const handlePatientFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setPatientForm({ ...patientForm, [id]: value });

    // Validate the specific field
    let error = "";
    switch (id) {
      case "firstName":
        error = validateName(value);
        break;
      case "age":
        break;
      case "salutation":
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

  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        const response = await axios.get(
          `/api/associatemaster/allassociates/${User?._id}`
        );
        console.log(response.data);
        setAssociates(response.data);
      } catch (error) {
        console.error("Error fetching associates:", error);
        toast.error("Failed to fetch associates.");
      }
    };
    fetchAssociates();
  }, []);

  useEffect(() => {
    console.log("This is referrals", referrals);
  }, [referrals]);
  // Validate Entire Form
  const validateForm = () => {
    const nameError = validateName(patientForm.firstName);
    const ageError = validateAge(patientForm.age);
    const phoneError = validatePhone(patientForm.salutation);
    const genderError = validateGender(patientForm.gender);

    setErrors({
      firstName: nameError,
      age: ageError,
      salutation: phoneError,
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
      firstName: patientForm?.firstName,
      age: date,
      salutation: patientForm?.salutation,
      gender: patientForm?.gender,
      userId: User?._id,
    };

    try {
      const response = await axios.post("/api/patients", requestSend);
      toast.success("Patient Added Successfully");
      setPatients([...patients, response.data]);
      setErrors({ firstName: "", age: "", salutation: "", gender: "" });
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient. Please try again.");
    }
  };

  // Update Top Component with Selected Referral and Patient
  useEffect(() => {
    console.log("Selected Refferal");
    const selectedRefferalid = referrals;
    const Component = {
      referral: selectedRefferalid,
      patientId: patientForm,
    };
    console.log("Selected Things", Component);
    setTopComp(Component);
  }, [selectedRefferal, patientForm, referrals, setTopComp]);

  return (
    <div className="flex space-x-4 w-full max-w-6xl ">
      {/* Patient Information Card */}
      <Card className="flex-1 bg-accent/40 shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Search and add patient details</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <ApiDrivenInputWithSuggestions setPatientForm={setPatientForm} />
              <Button onClick={() => navigate("/registration/patient/add")}>
                <Plus className="w-5 text-white" />
                Add Patient
              </Button>
            </form>

            {/* Add Patient Form */}
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-3   gap-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Patient's firstName"
                    value={patientForm.firstName}
                    disabled
                    onChange={handlePatientFormChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    placeholder="Patient's middleName"
                    disabled
                    value={patientForm.middleName}
                    onChange={handlePatientFormChange}
                    className={errors.middleName ? "border-red-500" : ""}
                  />
                  {errors.middleName && (
                    <span className="text-red-500 text-sm">
                      {errors.middleName}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Patient's lastName"
                    value={patientForm.lastName}
                    onChange={handlePatientFormChange}
                    disabled
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">
                      {errors.lastName}
                    </span>
                  )}
                </div>

                {/* Age Field */}
                <div className="space-y-2">
                  <Label htmlFor="age">Date of Birth</Label>

                  <DateTimePicker
                    granularity="day"
                    disabled={true}
                    displayFormat={{
                      hour24: "MM/dd/yyyy", // Customize to your preferred format
                      hour12: "MM/dd/yyyy", // Also customize for 12-hour format if relevant
                    }}
                    value={new Date(patientForm?.dob).getDate()}
                    onChange={setDate}
                  />

                  {errors.age && (
                    <span className="text-red-500 text-sm">{errors.age}</span>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="salutation">Salutation</Label>
                  <Input
                    id="salutation"
                    type="text"
                    disabled
                    placeholder="salutation"
                    value={patientForm.salutation}
                    onChange={handlePatientFormChange}
                    className={errors.salutation ? "border-red-500" : ""}
                  />
                  {errors.salutation && (
                    <span className="text-red-500 text-sm">
                      {errors.salutation}
                    </span>
                  )}
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={patientForm.gender}
                    disabled
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

                <div className="space-y-2">
                  <Label htmlFor="lastName">Blood Group</Label>
                  <Input
                    id="bloodGroup"
                    placeholder="bloodGroup"
                    value={patientForm.bloodGroup}
                    onChange={handlePatientFormChange}
                    disabled
                    className={errors.bloodGroup ? "border-red-500" : ""}
                  />
                  {errors.bloodGroup && (
                    <span className="text-red-500 text-sm">
                      {errors.bloodGroup}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Patient Type</Label>
                  <Input
                    id="patientType"
                    placeholder="patientType"
                    value={patientForm.patientType}
                    onChange={handlePatientFormChange}
                    disabled
                    className={errors.patientType ? "border-red-500" : ""}
                  />
                  {errors.patientType && (
                    <span className="text-red-500 text-sm">
                      {errors.patientType}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              {/* <Button
                type="submit"
                disabled={
                  !patientForm.firstName ||
                  !patientForm.salutation ||
                  !patientForm.gender ||
                  Object.values(errors).some((error) => error)
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Save Patient
              </Button> */}
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Referral Information Card */}
      <Card className="flex-1 bg-accent/40 shadow-md">
        <CardHeader className="flex justify-between">
          <div className="flex justify-between items-center">
            <CardTitle>Referral Information</CardTitle>
            <Button onClick={() => navigate("/registration/referral/add")}>
              Add Referral
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="referral">Primary Referred By</Label>
              <Select
                id="primaryRefferedBy"
                value={referrals.primaryRefferedBy}
                onValueChange={(value) => {
                  handleReferralChange("primaryRefferedBy", value);
                }}
              >
                <SelectTrigger id="referral">
                  <SelectValue placeholder="Select referral" />
                </SelectTrigger>
                <SelectContent>
                  {associates &&
                    associates.map((associate, index) => (
                      <SelectItem key={index} value={associate?._id}>
                        {associate?.firstName} {associate?.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referral">Secondary Referred By</Label>
              <Select
                value={referrals.secondaryRefferedBy}
                onValueChange={(value) => {
                  handleReferralChange("secondaryRefferedBy", value);
                }}
              >
                <SelectTrigger id="referral">
                  <SelectValue placeholder="Select referral" />
                </SelectTrigger>
                <SelectContent>
                  {associates &&
                    associates.map((associate, index) => (
                      <SelectItem key={index} value={associate?._id}>
                        {associate?.firstName} {associate?.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referral">Billed To</Label>
              <Select
                value={referrals.billedTo}
                onValueChange={(value) => {
                  handleReferralChange("billedTo", value);
                }}
              >
                <SelectTrigger id="referral">
                  <SelectValue placeholder="Select referral" />
                </SelectTrigger>
                <SelectContent>
                  {associates &&
                    associates.map((associate, index) => (
                      <SelectItem key={index} value={associate?._id}>
                        {associate?.firstName} {associate?.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referral">Corporate Customer</Label>
              <Select
                value={referrals.corporateCustomer}
                onValueChange={(value) => {
                  handleReferralChange("corporateCustomer", value);
                }}
              >
                <SelectTrigger id="referral">
                  <SelectValue placeholder="Select referral" />
                </SelectTrigger>
                <SelectContent>
                  {cooperateCustomer &&
                    cooperateCustomer.map((associate, index) => (
                      <SelectItem key={index} value={associate?._id}>
                        {associate?.corporateName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="referral">Clinic History</Label>
              <Input
                type="text"
                placeholder="New referral firstName"
                value={referrals.clinicHistory}
                onChange={(e) => {
                  handleReferralChange("clinicHistory", e.target.value);
                }}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="referral">Medication History</Label>
              <Input
                type="text"
                placeholder="New referral firstName"
                value={referrals.medicationHistory}
                onChange={(e) => {
                  handleReferralChange("medicationHistory", e.target.value);
                }}
              />
            </div>

            {/* <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="New referral firstName"
                value={newReferral}
                onChange={(e) => setNewReferral(e.target.value)}
              />
              <Button onClick={handleAddReferral}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

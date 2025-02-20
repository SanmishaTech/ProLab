import React from "react";
import Sidebar from "@/Dashboard/Sidebar";
import Dashboardcomponent from "@/Components/Dashboard/Dashboard";
import Registration from "@/Components/Registration/Registration";
import { useLocation } from "react-router-dom";
// import { RegistrationComponent } from "@/Dashboard/Registration/RegistrationTable";
import Dashboardholiday from "@/Components/Holiday/Registertable";
import DashboardPage from "@/Components/Registration/Dashbordcomp/Registertable";
import Dashboarddepartment from "@/Components/Department/Registertable";
import DashboardServices from "@/Components/Services/Registertable";
import Dashboardparameter from "@/Components/Parameter/Registertable";
import Dashboardreason from "@/Components/Reason/Registertable";
import DashboardBarcode from "@/Components/Barcode/Registertable";
import AssignAccess from "@/Components/AssignAccess/Dashboardreuse";
import DashboardHighlighter from "@/Components/Highlighter/Registertable";
import DashboardparameterGroup from "@/Components/ParameterGroup/Registertable";
import DashboardContainer from "@/Components/Container/Registertable";
import DashboardTestMaster from "@/Components/Testmaster/Registertable";
import Dashboardedittestcard from "@/Components/Testmaster/Edittestcard";
import DashboardTestLinkMaster from "@/Components/TestLinkMaster/Registertable";
import DashboardAssociateMaster from "@/Components/AssociateMaster/Registertable";
import DashboardPatientMaster from "@/Components/PatientMaster/Registertable";
import DashboardTatMaster from "@/Components/TatMaster/Registertable";
import DashboardTatCard from "@/Components/TatMaster/";
import ClinicalHistory from "@/Components/ClinicalHistory/Registertable";
import Dashboardprefix from "@/Components/PrefixMaster/Registertable";
import Specimen from "@/Components/Specimen/Registertable";
import DashboardTestcard from "@/Components/Testmaster/TestCard";
import TestCard from "@/Components/AssociateMaster/TestCard";
import EditCard from "@/Components/AssociateMaster/Edittestcard";
import PatientTestCard from "@/Components/PatientMaster/TestCard";
import PatientEditCard from "@/Components/PatientMaster/Edittestcard";
import MachineMaster from "@/Components/MachineMaster/Registertable";
import RoleMaster from "@/Components/RoleMaster/Registertable";
import DiscountMaster from "@/Components/DiscountMaster/Registertable";
import MachineLinkMaster from "@/Components/MachineLinkMaster/Registertable";
import PromoCodeMaster from "@/Components/PromoCodeMaster/Registertable";
import Formula from "../Components/Formula/Formula";
import DashboardTestuserMaster from "@/Components/UserMaster/TestCard";
import DashboardCorporateMaster from "@/Components/CorporateMaster/Registertable";
import CorporateTestCard from "@/Components/CorporateMaster/TestCard";
import CorporateEditCard from "@/Components/CorporateMaster/Edittestcard";
import DashboardUser from "@/Components/UserMaster/Registertable";
import DashboardedittestuserMaster from "@/Components/UserMaster/Edittestcard";
import ServicePayable from "@/Components/ServicePayable/Registertable";
import Labmaster from "@/Components/Labmaster/Labmaster";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ContainerLinkMaster from "@/Components/ContainerLinkMaster/Registertable";
import Autocomplete from "@/Components/Autocomplete/Autocomplete";
import CollectionMaster from "@/Components/CollectionMaster/Registertable";
import CollectionAdd from "@/Components/CollectionMaster/TestCard";
import DashboardEditTest from "@/Components/CollectionMaster/Edittestcard";
import SampleCollection from "@/Components/SampleCollection/Registertable";
import Innnerfile from "@/Components/SampleCollection/Innersamplecollection";
import Workinghours from "@/Components/Workinghours/Workinghours";
import Accession from "@/Components/Accession/Registertable";
import AccessionInner from "@/Components/Accession/Inneraccession";
import Referencerange from "@/Components/ReferenceRange/TestCard";
import Branchsetup from "@/Components/Branchsetup/branch";
import Makerchecker from "@/Components/MakerChecker/Makerchecker";
import AssociateType from "@/Components/Associatetype/Registertable";
import Medicationhistory from "@/Components/MedicationHistory/Registertable";
import ServiceAdd from "@/Components/ServicePayable/TestCard";
import TemplateAdd from "@/Components/TemplateMaster/TestCard";
import Template from "@/Components/TemplateMaster/Registertable";
import Edittemplate from "@/Components/TemplateMaster/EditTestCard";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);

  useEffect(() => {
    if (!User?._id) {
      navigate("/");
    }
  }, [location, User]);

  return (
    <div className="flex bg-background w-[100vw] h-full relative min-h-screen">
      <div className="min-h-screen relative top-0 bg-accent/40">
        <Sidebar className="min-h-full" />
      </div>
      <main className="w-full flex-1 overflow-hidden ">
        {location.pathname === "/dashboard" && <Dashboardcomponent />}
        {location.pathname === "/registrationlist" && <DashboardPage />}
        {/* {location.pathname === "/services" && <DashboardServices />} */}

        {location.pathname === "/holiday" && <Dashboardholiday />}
        {location.pathname === "/department" && <Dashboarddepartment />}
        {location.pathname === "/parameter" && <Dashboardparameter />}
        {location.pathname === "/reason" && <Dashboardreason />}
        {location.pathname === "/assignaccess" && <AssignAccess />}
        {location.pathname === "/barcode" && <DashboardBarcode />}
        {location.pathname === "/highlighter" && <DashboardHighlighter />}
        {location.pathname === "/prefix" && <Dashboardprefix />}
        {location.pathname === "/parametergroup" && <DashboardparameterGroup />}
        {location.pathname === "/specimen" && <Specimen />}
        {location.pathname === "/container" && <DashboardContainer />}
        {location.pathname === "/rolemaster" && <RoleMaster />}
        {location.pathname === "/testmaster" && <DashboardTestMaster />}
        {location.pathname === "/testmaster/add" && <DashboardTestcard />}
        {/\/testmaster\/edit\/\d+/.test(location.pathname) && (
          <Dashboardedittestcard />
        )}
        {location.pathname === "/testlinkmaster" && <DashboardTestLinkMaster />}
        {location.pathname === "/associatemaster" && (
          <DashboardAssociateMaster />
        )}
        {location.pathname === "/associatemaster/add" && <TestCard />}
        {/\/associatemaster\/edit\/\d+/.test(location.pathname) && <EditCard />}
        {location.pathname === "/corporate" && <DashboardCorporateMaster />}
        {location.pathname === "/corporate/add" && <CorporateTestCard />}
        {/\/corporate\/edit\/\d+/.test(location.pathname) && (
          <CorporateEditCard />
        )}
        {location.pathname === "/tatmaster" && <DashboardTatMaster />}
        {location.pathname === "/Formula" && <Formula />}
        {location.pathname === "/patientmaster" && <DashboardPatientMaster />}
        {location.pathname === "/patientmaster/add" && <PatientTestCard />}
        {/\/patientmaster\/edit\/\d+/.test(location.pathname) && (
          <PatientEditCard />
        )}
        {location.pathname === "/formula" && <Formula />}
        {location.pathname === "/machinemaster" && <MachineMaster />}
        {location.pathname === "/machinelinkmaster" && <MachineLinkMaster />}
        {location.pathname === "/promocodemaster" && <PromoCodeMaster />}
        {location.pathname === "/discountmaster" && <DiscountMaster />}
        {location.pathname === "/containerlinkmaster" && (
          <ContainerLinkMaster />
        )}
        {location.pathname === "/usermaster" && <DashboardUser />}
        {location.pathname === "/usermaster/add" && <DashboardTestuserMaster />}
        {/\/usermaster\/edit\/\d+/.test(location.pathname) && (
          <DashboardedittestuserMaster />
        )}
        {location.pathname === "/service" && <ServicePayable />}
        {location.pathname === "/service/add" && <ServiceAdd />}
        {location.pathname === "/labmaster" && <Labmaster />}
        {location.pathname === "/autocomplete" && <Autocomplete />}
        {location.pathname === "/collectionmaster" && <CollectionMaster />}
        {location.pathname === "/collectionmaster/add" && <CollectionAdd />}
        {/\/collectionmaster\/edit\/\d+/.test(location.pathname) && (
          <DashboardEditTest />
        )}
        {location.pathname === "/registration" && <Registration />}
        {location.pathname === "/registration/patient/add" && (
          <PatientTestCard />
        )}
        {location.pathname === "/registration/referral/add" && <TestCard />}
        {location.pathname === "/samplecollection" && <SampleCollection />}
        {location.pathname === "/workhours" && <Workinghours />}
        {location.pathname === "/accession" && <Accession />}
        {location.pathname === "/accession/verification" && <AccessionInner />}
        {location.pathname === "/referencerange" && <Referencerange />}
        {location.pathname === "/branchsetup" && <Branchsetup />}
        {location.pathname === "/makerchecker" && <Makerchecker />}
        {location.pathname === "/associatetype" && <AssociateType />}
        {location.pathname === "/medicationhistory" && <Medicationhistory />}
        {location.pathname === "/clinic" && <ClinicalHistory />}
        {location.pathname === "/template" && <Template />}
        {location.pathname === "/template/add" && <TemplateAdd />}

        {/\/template\/edit\/\d+/.test(location.pathname) && <Edittemplate />}
        {/\/samplecollection\/collect\/\d+/.test(location.pathname) && (
          <Innnerfile />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

import { NavItem } from "@/types";
import { Icon } from "lucide-react";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboardIcon",
  },
  {
    title: "Masters",
    href: "/lab",
    icon: "dashboardIcon",
    children: [
      {
        title: "Department",
        href: "/department",
        icon: "department",
      },
      {
        title: "Holiday",
        href: "/holiday",
        icon: "department",
      },
      {
        title: "Patient Master",
        href: "/patientmaster",
        icon: "test",
      },
    ],
  },
  {
    title: "Test Related Master",
    href: "/testmaster",
    icon: "sad",
    children: [
      {
        title: "Test Machine Link Master",
        href: "/machinelinkmaster",
        icon:"link2"
      },
      {
        title: "Test Parameter link Master",
        href: "/testlinkmaster",
        icon:"link"
      },
      {
        title: "Formula Master",
        href: "/formula",
        icon: "Formula",
      },
      {
        title: "Barcode Setup",
        href: "/barcode",
        icon:"barcode"
      },
      {
        title: "Rejection Reason Master",
        href: "/reason",
        icon: "Rejection",
      },
      {
        title: "Highlighter Master",
        href: "/highlighter",
        icon: "Highlighter",
      },

      {
        title: "Test Master",
        href: "/testmaster",
        icon: "test",
      },
      {
        title: "Container",
        href: "/container",
        icon: "container",
      },
      {
        title: "Parameters",
        href: "/parameter",
        icon: "pipette",
      },
      {
        title: "Parameter Group",
        href: "/parametergroup",
        icon: "pipette",
      },
      {
        title: "TaT Master",
        href: "/tatmaster",
        icon: "Tat",
      },
 
    ],
  },

  {
    title: "Lab Setup",
    href: "/lab",
    icon: "Asdsad",
    children: [
      {
        title: "Machine Master",
        href: "/machinemaster",
        icon: "Machine",
      },

      // {
      //   title: "Container Link Master",
      //   href: "/containerlinkmaster",
      // },
      {
        title: "Associate Master",
        href: "/associatemaster",
        icon: "Associate",
      },

      {
        title: "Specimen",
        href: "/specimen",
        icon: "specimen",
      },
      {
        title: "Corporate Master",
        href: "/corporate",
        icon: "department",
        
      },
    ],
  },
  // {
  //   title: "Parameter Link Master",
  //   href: "/testlinkmaster",
  //   icon: "dashboardIcon",
  // },
];

export const LoginSchema = [
  {
    LeftSection: {
      Logo: {
        type: "image",
        src: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        alt: "Logo",
      },
      Title: {
        type: "text",
        text: "Welcome to Website",
        SubText: "Sofia Davis",
        style: {
          fontSize: "24px",
          fontWeight: "bold",
          color: "#000000",
        },
      },
    },
    RightSection: {
      Text: {
        Title: "Create an account",
        SubTitle: "Enter your email below to create your account",
        TermsOfServiceSrc:
          "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        PrivacyPolicySrc:
          "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
      },
      AuthForm: {
        Email: {
          type: "text",
          variableType: "email",
          label: "Email",
          placeholder: "Enter your email...",
          className:
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        },

        Password: {
          type: "text",
          variableType: "string",
          label: "Password",
          placeholder: "Enter your password...",
          className:
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        },
      },
    },
  },
];

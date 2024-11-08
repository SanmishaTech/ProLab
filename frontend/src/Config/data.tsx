import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboardIcon",
  },

  {
    title: "Registration",
    href: "/registrationlist",
    icon: "settingsIcon",
    children: [
      {
        title: "Registration",
        href: "/registration",
      },
      {
        title: "All Registration",
        href: "/registrationlist",
      },
    ],
  },
  {
    title: "Test Master",
    href: "/testmaster",
    icon: "dashboardIcon",
  },
  {
    title: "Test Link Master",
    href: "/testlinkmaster",
    icon: "dashboardIcon",
  },
  {
    title: "Container",
    href: "/container",
    icon: "dashboardIcon",
  },
  {
    title: "Specimen",
    href: "/specimen",
    icon: "dashboardIcon",
  },
  {
    title: "Parameters",
    href: "/parameter",
    icon: "dashboardIcon",
  },
  {
    title: "Parameter Group",
    href: "/parametergroup",
    icon: "dashboardIcon",
  },
  {
    title: "Department",
    href: "/department",
    icon: "dashboardIcon",
  },
  {
    title: "Holiday",
    href: "/holiday",
    icon: "dashboardIcon",
  },

  {
    title: "Reports",
    href: "/reports",
    icon: "reportsIcon",
    children: [
      {
        title: "Sales",
        href: "/reports/sales",
      },
      {
        title: "Expenses",
        href: "/reports/expenses",
        disabled: true,
      },
    ],
  },
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

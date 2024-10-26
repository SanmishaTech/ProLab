// SampleNavItems.ts

export const sampleNavItems: NavItem[] = [
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

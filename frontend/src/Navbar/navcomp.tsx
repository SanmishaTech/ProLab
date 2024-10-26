"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Search } from "@/components/icons/search";
import { Menu, CircleUser, Package2 } from "lucide-react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Assign Access",
    href: "/dashboard",
    description: "Assigns User Access to Specific Roles and Resources.",
  },
  {
    title: "Module Group",
    href: "/dashboard",
    description: "Group of All the Modules.",
  },
  {
    title: "Page List",
    href: "/dashboard",
    description: "List of all the pages.",
  },
  {
    title: "Assign Access to User",
    href: "/dashboard",
    description: "Assigns Access to specific User.",
  },
  {
    title: "Modules",
    href: "/dashboard",
    description: "All the Modules.",
  },
  {
    title: "Cancel Printing",
    href: "/dashboard",
    description: "Cancel Printing of a Module.",
  },
  {
    title: "Role Master",
    href: "/dashboard",
    description: "Master of all the Roles assiged to a Users.",
  },
  {
    title: "Dashboard Setup",
    href: "/dashboard",
    description: "Stepup Your Dashboard as per your needs",
  },
  {
    title: "Print Setup",
    href: "/dashboard",
    description: "Setup Your priting configuration",
  },
  {
    title: "View Error",
    href: "/dashboard",
    description: "View Errors caused during process",
  },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Access Control</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

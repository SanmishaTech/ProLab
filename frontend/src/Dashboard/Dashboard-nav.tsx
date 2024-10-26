// DashboardNav.tsx
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch } from "react";
import { useSidebar } from "./togglesidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Icons } from "./Icon"; // Ensure this is correctly imported and includes chevronDown

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<React.SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const location = useLocation();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        <Accordion type="multiple" className="w-full">
          {items.map((item, index) => {
            const Icon = Icons[item.icon || "arrowRight"];
            const isActive = location.pathname === item.href;
            const hasChildren = item.children && item.children.length > 0;

            // Retrieve ChevronDown Icon
            const ChevronDownIcon = Icons["chevronDown"];

            if (hasChildren) {
              return (
                <AccordionItem value={item.title} key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AccordionTrigger
                        className={cn(
                          "flex items-center justify-between pl-2 pr-2 w-full gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-secondary hover:text-accent-foreground",
                          isActive ? "bg-nav text-black" : "transparent",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                        disabled={item.disabled}
                      >
                        <div className="flex items-center gap-2">
                          {Icon && (
                            <Icon
                              className={`ml-3 size-5 flex-none ${
                                isActive
                                  ? "text-accent text-black"
                                  : "text-accentlight"
                              }`}
                            />
                          )}
                          {isMobileNav || (!isMinimized && !isMobileNav) ? (
                            <span className="mr-2 truncate dark:text-[#e6e6e7] text-black">
                              {item.title}
                            </span>
                          ) : null}
                        </div>
                        {/* Chevron Icon for Accordion */}
                        {/* {ChevronDownIcon && (
                          <ChevronDownIcon
                            className={cn(
                              "size-4 transition-transform",
                              "group-data-[state=open]:rotate-180"
                            )}
                          />
                        )} */}
                      </AccordionTrigger>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      side="right"
                      sideOffset={8}
                      className={!isMinimized ? "hidden" : "inline-block"}
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                  <AccordionContent className=" mt-2 space-y-1">
                    {item.children!.map((child, childIndex) => {
                      const ChildIcon = Icons[child.icon || "arrowRight"];
                      const isChildActive = location.pathname === child.href;

                      return (
                        <Link
                          key={childIndex}
                          to={child.disabled ? "/" : child.href}
                          className={cn(
                            "flex items-center gap-2 overflow-hidden rounded-md py-1 text-sm font-medium hover:bg-secondary hover:text-accent-foreground",
                            isChildActive
                              ? "bg-accent text-accent"
                              : "transparent",
                            child.disabled && "cursor-not-allowed opacity-80"
                          )}
                          onClick={() => {
                            if (setOpen) setOpen(false);
                          }}
                        >
                          {ChildIcon && (
                            <ChildIcon
                              className={`ml-6 size-4 flex-none ${
                                isChildActive
                                  ? "text-accent"
                                  : "text-accentlight"
                              }`}
                            />
                          )}
                          {isMobileNav || (!isMinimized && !isMobileNav) ? (
                            <span className="mr-2 truncate dark:text-[#e6e6e7] text-black">
                              {child.title}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            } else {
              return (
                <AccordionItem value={item.title} key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.disabled ? "/" : item.href}
                        className={cn(
                          "flex items-center gap-2 overflow-hidden text-black rounded-md py-2 pl-2 text-sm font-medium hover:bg-secondary hover:text-accent-foreground",
                          isActive ? "bg-accent text-black" : "transparent",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                        onClick={() => {
                          if (setOpen) setOpen(false);
                        }}
                      >
                        {Icon && (
                          <Icon
                            className={`ml-3 size-5 flex-none ${
                              isActive
                                ? "text-accent text-black"
                                : "text-accentlight"
                            }`}
                          />
                        )}
                        {isMobileNav || (!isMinimized && !isMobileNav) ? (
                          <span className="mr-2 truncate dark:text-[#e6e6e7] text-black">
                            {item.title}
                          </span>
                        ) : null}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      align="center"
                      side="right"
                      sideOffset={8}
                      className={!isMinimized ? "hidden" : "inline-block"}
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </AccordionItem>
              );
            }
          })}
        </Accordion>
      </TooltipProvider>
    </nav>
  );
}

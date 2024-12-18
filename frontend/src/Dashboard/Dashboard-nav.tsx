import { useState } from "react";
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
import { Icons } from "./Icon";

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
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const location = useLocation();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider delayDuration={0}>
        <Accordion
          type="multiple"
          className="w-full"
          onValueChange={(value) => {
            setActiveAccordion(value.length ? value[0] : null);
          }}
        >
          {items.map((item, index) => {
            const Icon = Icons[item.icon || "group"];
            const isActive = location.pathname === item.href;
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <AccordionItem value={item.title} key={index}>
                  {isMinimized && !isMobileNav ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AccordionTrigger
                          className={cn(
                            "flex items-center justify-between pl-2 pr-2 w-full gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-secondary hover:text-iconActive",
                            isActive ? "bg-nav text-black" : "transparent",
                            item.disabled && "cursor-not-allowed opacity-80"
                          )}
                          disabled={item.disabled}
                        >
                          <div className="flex items-center gap-2">
                            {Icon && (
                              <Icon
                                className={`ml-3 size-5 flex-none ${
                                  activeAccordion === item.title
                                    ? "text-black"
                                    : "text-iconDark"
                                }`}
                              />
                            )}
                          </div>
                        </AccordionTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="z-50 bg-white">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <AccordionTrigger
                      className={cn(
                        "flex items-center justify-between pl-2 pr-2 w-full gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-secondary hover:text-iconActive",
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
                                ? "text-iconActive text-black"
                                : "text-iconActive"
                            }`}
                          />
                        )}
                        <span className="mr-2 truncate dark:text-[#e6e6e7] text-black">
                          {item.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                  )}
                  <AccordionContent className="mt-2 space-y-1">
                    {item.children!.map((child, childIndex) => {
                      const ChildIcon = Icons[child.icon || "arrowRight"];
                      const isChildActive = location.pathname === child.href;

                      return isMinimized && !isMobileNav ? (
                        <Tooltip key={childIndex}>
                          <TooltipTrigger asChild>
                            <Link
                              to={child.disabled ? "/" : child.href}
                              className={cn(
                                "flex items-center gap-2 overflow-hidden rounded-md py-1 text-sm font-medium hover:bg-secondary hover:text-accent-foreground",
                                isChildActive
                                  ? "bg-accent text-iconActive"
                                  : "transparent",
                                child.disabled &&
                                  "cursor-not-allowed opacity-80"
                              )}
                              onClick={() => {
                                if (setOpen) setOpen(false);
                              }}
                            >
                              {ChildIcon && (
                                <ChildIcon
                                  className={`ml-6 size-4 flex-none ${
                                    isChildActive
                                      ? "text-iconActive"
                                      : "text-iconDark"
                                  }`}
                                />
                              )}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="z-50">
                            {child.title}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Link
                          key={childIndex}
                          to={child.disabled ? "/" : child.href}
                          className={cn(
                            "flex items-center gap-2 overflow-hidden rounded-md py-1 text-sm font-medium hover:bg-secondary hover:text-accent-foreground",
                            isChildActive
                              ? "bg-accent text-iconActive"
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
                                  ? "text-iconActive"
                                  : "text-iconDark"
                              }`}
                            />
                          )}
                          <span className="mr-2 truncate dark:text-[#e6e6e7] text-black">
                            {child.title}
                          </span>
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            } else {
              return (
                <AccordionItem value={item.title} key={index}>
                  {isMinimized && !isMobileNav ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.disabled ? "/" : item.href}
                          className={cn(
                            "flex items-center gap-2 overflow-hidden text-black rounded-md py-2 pl-2 text-sm font-medium hover:bg-secondary hover:text-accent-foreground",
                            isActive ? "bg-accent text-black" : "transparent ",
                            item.disabled && "cursor-not-allowed opacity-80"
                          )}
                          onClick={() => {
                            if (setOpen) setOpen(false);
                          }}
                        >
                          {Icon && (
                            <Icon
                              className={`ml-3 size-5 flex-none ${
                                isActive ? "text-black" : "text-gray-400"
                              }`}
                            />
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="z-50">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
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
                            isActive ? "text-black" : "text-gray-400"
                          }`}
                        />
                      )}
                      <span className="mr-2 truncate dark:text-[#e6e6e7] text-black">
                        {item.title}
                      </span>
                    </Link>
                  )}
                </AccordionItem>
              );
            }
          })}
        </Accordion>
      </TooltipProvider>
    </nav>
  );
}

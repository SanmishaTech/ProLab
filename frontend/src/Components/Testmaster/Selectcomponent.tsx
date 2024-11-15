import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export type Option = {
  value: string;
  label: string;
  id: string;
};

interface FancyMultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  defaultValue?: string[] | Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxItems?: number;
  isLoading?: boolean;
}

export default function FancyMultiSelect({
  options,
  value = [],
  onChange,
  defaultValue = [],
  placeholder = "Select options...",
  className = "",
  disabled = false,
  maxItems,
  isLoading = false,
}: FancyMultiSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    if (!initialized && defaultValue.length > 0 && value.length === 0) {
      const initialValues = defaultValue.map((item) => {
        if (typeof item === "string") {
          const option = options.find((opt) => opt.value === item);
          return option || { value: item, label: item };
        }
        return item;
      });

      onChange(initialValues);
      setInitialized(true);
    }
  }, [defaultValue, options, initialized, onChange, value]);

  const handleUnselect = React.useCallback(
    (option: Option) => {
      onChange(value.filter((item) => item.value !== option.value));
    },
    [onChange, value]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            onChange(value.slice(0, -1));
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange, value]
  );

  const selectables = options.filter(
    (option) =>
      value &&
      !value?.some((item) => item.value === option.value) &&
      (inputValue === "" ||
        option.label.toLowerCase().includes(inputValue.toLowerCase()))
  );

  const canAddMore = !maxItems || value.length < maxItems;

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 h-10 px-3 py-2 text-sm border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-muted-foreground">Loading options...</span>
      </div>
    );
  }

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className}`}
    >
      <div
        className={`group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex flex-wrap gap-1">
          {value.map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                {!disabled && (
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option)}
                    type="button"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </Badge>
            );
          })}
          {canAddMore && !disabled && (
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={value.length === 0 ? placeholder : "Add more..."}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          )}
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 && canAddMore && !disabled ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        onChange([...value, option]);
                      }}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}

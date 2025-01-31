import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  X,
  Divide,
  RefreshCcw,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const AdvancedFormulaBuilder = () => {
  // Sample parameters (in real app, fetch from API)
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [parameters] = useState([
    { id: 1, name: "CBC", value: "cbc" },
    { id: 2, name: "Hematology", value: "hematology" },
    { id: 3, name: "Blood Sugar", value: "blood_sugar" },
    { id: 4, name: "Cholesterol", value: "cholesterol" },
    { id: 5, name: "Triglycerides", value: "triglycerides" },
  ]);

  const [formula, setFormula] = useState([]);
  const [activeTab, setActiveTab] = useState("numbers"); // 'numbers' | 'parameters'

  useEffect(() => {
    const formulaString = formula.map((item) => item.value).join(" ");
    console.log("This is the formula", formulaString);
  }, [formula]);
  const addNumber = (num) => {
    if (formula.length > 0 && formula[formula.length - 1].type === "number") {
      const lastItem = formula[formula.length - 1];
      const newValue = lastItem.value + num.toString();
      const newFormula = [...formula];
      newFormula[newFormula.length - 1] = { ...lastItem, value: newValue };
      setFormula(newFormula);
    } else {
      setFormula([...formula, { type: "number", value: num.toString() }]);
    }
  };

  const addOperator = (operator) => {
    setFormula([...formula, { type: "operator", value: operator }]);
  };

  const addBracket = (bracket) => {
    setFormula([...formula, { type: "bracket", value: bracket }]);
  };

  const addParameter = (param) => {
    setFormula([
      ...formula,
      { type: "parameter", value: param.value, display: param.name },
    ]);
  };

  const removeItem = (index) => {
    setFormula(formula.filter((_, i) => i !== index));
  };

  const clearFormula = () => {
    setFormula([]);
  };

  const renderFormulaItem = (item, index) => {
    let className = "flex items-center px-3 py-2 rounded text-sm font-medium ";
    switch (item.type) {
      case "number":
        className += "bg-gray-100";
        break;
      case "operator":
        className += "bg-blue-100 text-blue-700";
        break;
      case "bracket":
        className += "bg-purple-100 text-purple-700 text-lg";
        break;
      case "parameter":
        className += "bg-green-100 text-green-700";
        break;
    }

    return (
      <div key={index} className="flex items-center gap-1 relative">
        <div className={className}>
          {item.type === "parameter" ? item.display : item.value}
        </div>
        <button
          onClick={() => removeItem(index)}
          className="p-1 hover:bg-red-100 rounded absolute top-[-.5rem] right-[-.5rem]"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    );
  };

  const buttonClass = "p-3 text-sm font-medium rounded-lg transition-colors";
  const numberButtonClass = `${buttonClass} bg-gray-100 hover:bg-gray-200`;
  const operatorButtonClass = `${buttonClass} bg-blue-100 hover:bg-blue-200 text-blue-700`;
  const bracketButtonClass = `${buttonClass} bg-purple-100 hover:bg-purple-200 text-purple-700`;
  const parameterButtonClass = `${buttonClass} bg-green-100 hover:bg-green-200 text-green-700 text-left`;

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Card className="w-full h-screen p-4">
        <CardHeader>
          <CardTitle>Formula Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? frameworks.find((framework) => framework.value === value)
                        ?.label
                    : "Select framework..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === framework.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/* Formula Display */}
          <div className="p-4 min-h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-wrap gap-2 items-center">
            {formula.length === 0 ? (
              <span className="text-gray-400">
                Your formula will appear here...
              </span>
            ) : (
              formula.map((item, index) => renderFormulaItem(item, index))
            )}
          </div>
          <div className="col-span-4 border-b p-4">
            <h3 className="font-medium mb-2 text-gray-700">Parameters</h3>
            <div className="space-y-2 flex flex-wrap gap-2">
              {parameters.map((param) => (
                <button
                  key={param.id}
                  onClick={() => addParameter(param)}
                  className={parameterButtonClass}
                >
                  <div className="flex items-center justify-between">
                    {param.name}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button
                    key={num}
                    onClick={() => addNumber(num)}
                    className={numberButtonClass}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={clearFormula}
                  className={`${buttonClass} bg-red-100 hover:bg-red-200 text-red-700`}
                >
                  Clear
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => addOperator("+")}
                  className={operatorButtonClass}
                >
                  +
                </button>
                <button
                  onClick={() => addOperator("-")}
                  className={operatorButtonClass}
                >
                  −
                </button>
                <button
                  onClick={() => addOperator("×")}
                  className={operatorButtonClass}
                >
                  ×
                </button>
                <button
                  onClick={() => addOperator("÷")}
                  className={operatorButtonClass}
                >
                  ÷
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addBracket("(")}
                  className={bracketButtonClass}
                >
                  (
                </button>
                <button
                  onClick={() => addBracket(")")}
                  className={bracketButtonClass}
                >
                  )
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Example format: ( CBC × (Hematology × 100) × 2 )
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedFormulaBuilder;

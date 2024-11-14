import React, { useState } from "react";
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

const AdvancedFormulaBuilder = () => {
  // Sample parameters (in real app, fetch from API)
  const [parameters] = useState([
    { id: 1, name: "CBC", value: "cbc" },
    { id: 2, name: "Hematology", value: "hematology" },
    { id: 3, name: "Blood Sugar", value: "blood_sugar" },
    { id: 4, name: "Cholesterol", value: "cholesterol" },
    { id: 5, name: "Triglycerides", value: "triglycerides" },
  ]);

  const [formula, setFormula] = useState([]);
  const [activeTab, setActiveTab] = useState("numbers"); // 'numbers' | 'parameters'

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
      <div key={index} className="flex items-center gap-1">
        <div className={className}>
          {item.type === "parameter" ? item.display : item.value}
        </div>
        <button
          onClick={() => removeItem(index)}
          className="p-1 hover:bg-red-100 rounded"
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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Formula Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Controls */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Panel - Numbers & Operators */}
          <div className="col-span-8 space-y-4">
            {/* Numbers */}
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

            {/* Operators and Brackets */}
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

          {/* Right Panel - Parameters */}
          <div className="col-span-4 border-l pl-4">
            <h3 className="font-medium mb-2 text-gray-700">Parameters</h3>
            <div className="space-y-2">
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
        </div>

        {/* Example/Preview */}
        <div className="text-sm text-gray-500">
          Example format: ( CBC × (Hematology × 100) × 2 )
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFormulaBuilder;

"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import axios from "axios";

interface Suggestion {
  id: string;
  name: string;
  // Add other properties as needed
}

// Mock API function
const fetchSuggestions = async (
  query: string,
  userId: string
): Promise<Suggestion[]> => {
  // Simulating API delay
  // await new Promise((resolve) => setTimeout(resolve, 300));

  // const mockData: Suggestion[] = [
  //   { id: "1", name: "React" },
  //   { id: "2", name: "Vue" },
  //   { id: "3", name: "Angular" },
  //   { id: "4", name: "Svelte" },
  //   { id: "5", name: "Next.js" },
  //   { id: "6", name: "Nuxt.js" },
  //   { id: "7", name: "SvelteKit" },
  //   { id: "8", name: "Remix" },
  //   { id: "9", name: "Astro" },
  //   { id: "10", name: "Gatsby" },
  // ];
  const response = await axios.get(`/api/patients/search/${query}/${userId}`);
  console.log(response, response.data);

  return response?.data?.filter((item) =>
    item?.name?.toLowerCase()?.includes(query.toLowerCase())
  );
};

export default function ApiDrivenInputWithSuggestions({ setPatientForm }) {
  const user = localStorage.getItem("user");
  const User = JSON.parse(user);
  const [inputValue, setInputValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState<Suggestion | null>(
    null
  );
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(-1);
  const [isLoading, setIsLoading] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedValue(null);

    if (value.length > 0) {
      setIsLoading(true);
      try {
        const fetchedSuggestions = await fetchSuggestions(value, User?._id);
        setSuggestions(fetchedSuggestions);
        setShowSuggestions(true);
        setActiveSuggestionIndex(-1);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(`${suggestion.name}`);
    setSelectedValue(suggestion);
    setShowSuggestions(false);

    // Update the patient form with all necessary fields
    setPatientForm({
      _id: suggestion._id,
      name: `${suggestion.name}`,
      age: suggestion.age.toString(),
      phone: suggestion.phone,
      gender: suggestion.gender,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, -1));
    } else if (e.key === "Enter" && activeSuggestionIndex > -1) {
      const selectedSuggestion = suggestions[activeSuggestionIndex];
      setInputValue(selectedSuggestion.name);
      setSelectedValue(selectedSuggestion);
      setShowSuggestions(false);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    console.log(selectedValue);
  }, [selectedValue]);
  return (
    <div className="relative w-full max-w-sm">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type to search..."
        className="w-full"
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-expanded={showSuggestions}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden"
        >
          <ScrollArea className="max-h-[200px]">
            <div id="suggestions-list" role="listbox" className="py-1">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm cursor-pointer",
                    "transition-colors duration-150 ease-in-out",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    index === activeSuggestionIndex &&
                      "bg-gray-100 dark:bg-gray-700",
                    selectedValue?.id === suggestion.id && ""
                  )}
                  role="option"
                  aria-selected={index === activeSuggestionIndex}
                >
                  <span className="flex-grow ">
                    {`${suggestion?.name}  ${suggestion?.phone}`}
                  </span>
                  {/* {selectedValue?.id === suggestion.id && (
                    <Check className="h-4 w-4 text-primary ml-2" />
                  )} */}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      {/* {selectedValue && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Selected:{" "}
          <span className="font-medium text-primary">
            {selectedValue.name}
          </span>
        </div>
      )} */}
    </div>
  );
}

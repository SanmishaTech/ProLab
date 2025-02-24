"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MultiselectComponentreuse({
  users,
  setassociates,
  associates,
}) {
  //   const [selected, setSelected] = React.useState<string[]>([]);

  const renderUser = (option: (typeof users)[0]) => (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={option.avatar} />
        <AvatarFallback>{option.label[0]}</AvatarFallback>
      </Avatar>
      {option.label}
    </div>
  );

  const renderSelected = (value: string[]) => (
    <div className="flex -space-x-2">
      {value.map((id) => {
        const user = users.find((u) => u.value === id)!;
        return (
          <Avatar key={id} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.label[0]}</AvatarFallback>
          </Avatar>
        );
      })}
    </div>
  );

  return (
    <MultiSelectCombobox
      label="Associates"
      options={users}
      value={associates}
      onChange={setassociates}
      renderItem={renderUser}
      renderSelectedItem={renderSelected}
    />
  );
}

// export { MultiselectComponentreuse };

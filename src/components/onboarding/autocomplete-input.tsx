"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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
import { cn } from "@/lib/utils";

export function AutoCompleteInput({
  text = "Select...",
  data,
  className,
  value,
  setValue,
}: {
  text?: string;
  data: string[];
  className?: string;
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Remove duplicates from data array
  const uniqueData = React.useMemo(() => Array.from(new Set(data)), [data]);

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return uniqueData;
    return uniqueData.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [uniqueData, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between ml-4"
        >
          {value ? uniqueData.find((d) => d === value) : text}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={className}>
        <Command>
          <CommandInput
            placeholder="Search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filteredData.map((d, index) => (
                <CommandItem
                  key={d} // Changed from index to actual value
                  value={d}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSearchQuery(""); // Reset search query when item is selected
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === d ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {d}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

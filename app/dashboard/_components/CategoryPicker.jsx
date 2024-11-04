"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

function CategoryPicker({ type, onChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) {
      return;
    }

    onChange(value); // when value changes, call onChange
  }, [value, onChange]);

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const response = await fetch(`/api/categories?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });

  const selectedQuery = categoriesQuery.data?.find(
    (category) => category.name === value
  );

  const successCallback = useCallback(
    (category) => {
      setValue(category.name);
      setOpen(false);
    },
    [setValue, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedQuery ? (
            <CategoryRow category={selectedQuery} />
          ) : (
            "Select a category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} successCallback={successCallback} />
          <CommandEmpty>
            <p>No categories found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandList>
            {categoriesQuery.data &&
              categoriesQuery.data.map((category) => (
                <CommandItem
                  key={category.name}
                  onSelect={() => {
                    setValue(category.name);
                    setOpen(false);
                  }}
                >
                  <CategoryRow category={category} />
                  <Check
                    className={cn(
                      "mr-2 w-4 h-4 opacity-0",
                      value === category.name && "opacity-100"
                    )}
                  />
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

CategoryPicker.propTypes = {
  type: PropTypes.oneOf(["income", "expense"]).isRequired,
  onChange: PropTypes.func.isRequired,
};
export default CategoryPicker;

function CategoryRow({ category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}

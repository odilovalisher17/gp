import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ComboboxDemo({ field, form }) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     if (searchValue.trim().length > 0) {
  //       const timeout = setTimeout(() => {
  //         fetch(
  //           `http://${import.meta.env.VITE_BACKEND_URL}/api/airflow/dag/create?table=${searchValue.trim()}`,
  //         )
  //           .then((res) => res.json())
  //           .then((data) => {
  //             setTables(data);
  //           });
  //       }, 1500);

  //       return () => clearTimeout(timeout);
  //     }
  //   }, [searchValue]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `http://${import.meta.env.VITE_BACKEND_URL}/api/airflow/dag/create/all-tables?table=test`,
    )
      .then((res) => res.json())
      .then((data) => {
        setTables(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="!w-[90%]"
          onBlur={field.onBlur}
        >
          {field.value
            ? tables.find((t) => t === field.value)
            : "Select table..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search table..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>
            {isLoading ? "Loading tables ..." : "No table found."}
          </CommandEmpty>

          <CommandGroup>
            {tables
              .filter((t) =>
                t.toLowerCase().includes(searchValue.toLowerCase()),
              )
              .sort((a, b) => a.length - b.length)
              .slice(0, 10)
              .map((table) => (
                <CommandItem
                  key={table}
                  value={table}
                  onSelect={(currentValue) => {
                    field.onChange(currentValue);
                    form.reset({
                      ...form.formState.defaultValues,
                      target_table: undefined,
                      key_column: undefined,
                      source_table: currentValue,
                    });
                    setOpen(false);
                  }}
                >
                  {table}
                  <Check
                    className={cn(
                      "ml-auto",
                      field.value === table ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

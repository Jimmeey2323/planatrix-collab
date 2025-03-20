import React, { useState, useRef, useCallback } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { X, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  allowCustomValues?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
  loading = false,
  allowCustomValues = false,
}: MultiSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback((value: string) => {
    onChange(selected.filter((item) => item !== value));
  }, [selected, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          handleUnselect(selected[selected.length - 1]);
        }
      }
      
      // Handle custom value addition via Enter key
      if (e.key === "Enter" && inputValue && allowCustomValues) {
        e.preventDefault();
        const lowercaseValue = inputValue.toLowerCase();
        
        // Check if it already exists in options
        const existingOption = options.find(
          option => option.value.toLowerCase() === lowercaseValue || 
                    option.label.toLowerCase() === lowercaseValue
        );
        
        if (existingOption) {
          // If it exists, use the existing value
          if (!selected.includes(existingOption.value)) {
            onChange([...selected, existingOption.value]);
          }
        } else {
          // Otherwise create a new option
          const newValue = inputValue.trim();
          if (newValue && !selected.includes(newValue)) {
            onChange([...selected, newValue]);
          }
        }
        
        setInputValue("");
      }
    }
  }, [inputRef, inputValue, selected, options, handleUnselect, onChange, allowCustomValues]);

  const selectables = options.filter((option) => !selected.includes(option.value));

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={cn("overflow-visible bg-transparent", className)}
    >
      <div
        className={cn(
          "group border border-input px-3 py-2 text-sm rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex items-center gap-1 flex-wrap",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
            setOpen(true);
          }
        }}
      >
        {selected.length > 0 && (
          <>
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value);
              const label = option ? option.label : value; // Use value as fallback if option not found
              
              return (
                <Badge key={value} variant="secondary" className="mr-1 mb-1">
                  {label}
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(value);
                    }}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
          </>
        )}
        
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          disabled={disabled}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
        
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin opacity-50" />
        ) : (
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
      
      <div className="relative">
        {open && !disabled && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : selectables.length > 0 ? (
                <CommandGroup>
                  {selectables.map((option) => {
                    const isSelected = selected.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          onChange(
                            isSelected
                              ? selected.filter((value) => value !== option.value)
                              : [...selected, option.value]
                          );
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : (
                <CommandEmpty>
                  {allowCustomValues && inputValue
                    ? `Press enter to add "${inputValue}"`
                    : "No items found."}
                </CommandEmpty>
              )}
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  );
}

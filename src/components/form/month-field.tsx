import { FormFieldType } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn, formatDate, formatDateForInput, formatMonth } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { MonthPicker } from "../ui/month-picker";

export default function MonthField({ field }: { field: FormFieldType }) {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={field.name}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !field.value && "text-muted-foreground",
            !field?.isValid && "border-destructive dark:border-destructive"
          )}
        >
          {field.value ? (
            formatMonth(field.value)
          ) : (
            <span>{field?.placeholder || "Pick a month"}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <MonthPicker
          selectedMonth={field.value ? new Date(field.value) : undefined}
          onMonthSelect={(date) => {
            field?.handleChange(formatDateForInput(date))
            field.handleBlur?.()
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
import { FormFieldType } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function DateField({ field }: { field: FormFieldType }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !field.value && "text-muted-foreground"
          )}
        >
          {field.value ? (
            formatDate(field.value)
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.handleChange}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function DatePicker({
  date,
  setDate,
  fromDate,
  toDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  fromDate?: Date | undefined;
  toDate?: Date | undefined;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full text-sm gap-2  group inline-flex items-center bg-white justify-center outline-none  h-fit   rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "eeee") : <span>Pick a date</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          fromDate={new Date(`${fromDate}`)}
          toDate={new Date(`${toDate}`)}
        />
      </PopoverContent>
    </Popover>
  );
}

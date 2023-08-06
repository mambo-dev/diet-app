import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectProps = {
  values: string[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
};
export function SelectInput({ setValue, values }: SelectProps) {
  return (
    <Select onValueChange={(value) => setValue(value)}>
      <SelectTrigger className="text-sm gap-2  group inline-flex items-center bg-white justify-between outline-none  h-fit rounded-full  rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3">
        <SelectValue placeholder="Select the meal type" />
      </SelectTrigger>
      <SelectContent>
        {values.map((value, index) => {
          return (
            <SelectItem
              className="first-letter:uppercase"
              key={index}
              value={value}
            >
              {value}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

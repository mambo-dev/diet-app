"use client";
import React, { useState } from "react";
import { z } from "zod";

import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { log_progress_schema } from "../../../../lib/schemas/schemas";
import { toast } from "../../../ui/toast";
import { DatePicker } from "../../../ui/datepicker";
import { Input } from "../../../ui/input";
import { log_progress } from "../../../../lib/fetch/statistics/log-progress/progress";
import Button from "../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

type Props = {};

export default function LogProgress({}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full py-2 border border-slate-300 px-2 inline-flex items-center justify-center shadow-sm bg-white rounded-lg outline-none focus:shadow text-sm font-semibold text-slate-700">
          Log progress
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <LogProgressForm />
      </PopoverContent>
    </Popover>
  );
}

function LogProgressForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [energyLevel, setEnergyLevel] = useState("");
  const [values, setValues] = useState<z.infer<typeof log_progress_schema>>({
    progress_date: date ?? new Date(),
    //@ts-ignore
    progress_energyLevel: energyLevel,
    progress_exercise: "",
    progress_hips: 0,
    progress_mood: "",
    progress_notes: "",
    progress_waist: 0,
    progress_weight: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const access_token = Cookies.get("access_token") ?? "";
      const validated_values = log_progress_schema.parse({
        ...values,
        progress_hips: Number(values.progress_hips),
        progress_waist: Number(values.progress_waist),
        progress_weight: Number(values.progress_weight),
        progress_energyLevel: energyLevel,
        prgoress_date: date,
      });
      console.log(
        "date",
        date,
        "validated values",
        validated_values.progress_date
      );

      if (!date) {
        toast({
          message: "no set date",
          title: "no date",
          type: "error",
        });
        return;
      }

      await log_progress({
        access_token,
        progress: {
          ...validated_values,
          progress_date: date,
        },
      });

      toast({
        message: "great thank you. Consistency is key",
        title: "Progress logged, ",
        type: "success",
      });

      setValues({
        progress_date: date ?? new Date(),
        //@ts-ignore
        progress_energyLevel: energyLevel,
        progress_exercise: "",
        progress_hips: 0,
        progress_mood: "",
        progress_notes: "",
        progress_waist: 0,
        progress_weight: 0,
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          toast({
            message: issue.message,
            title: "Invalid inputs",
            type: "error",
          });
        });
        return;
      }

      toast({
        message:
          "You did everything right - but we could not log your progress",
        title: "Server Error",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="w-full flex items-center flex-col gap-2 "
      onSubmit={handleSubmit}
    >
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>date</label>
        <div className="flex-1 w-full col-span-3">
          <DatePicker date={date} setDate={setDate} />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>weight</label>
        <div className="flex-1 w-full col-span-3">
          <Input
            value={values.progress_weight}
            onChange={handleChange}
            name="progress_weight"
            type="number"
          />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>waist</label>
        <div className="flex-1 w-full col-span-3">
          <Input
            value={values.progress_waist}
            onChange={handleChange}
            name="progress_waist"
            type="number"
          />
        </div>
      </div>

      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>hips</label>
        <div className="flex-1 w-full col-span-3">
          <Input
            value={values.progress_hips}
            onChange={handleChange}
            name="progress_hips"
            type="number"
          />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>mood</label>
        <div className="flex-1 w-full col-span-3">
          <Input
            value={values.progress_mood}
            onChange={handleChange}
            name="progress_mood"
            type="text"
          />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>exercise</label>
        <div className="flex-1 w-full col-span-3">
          <Input
            value={values.progress_exercise}
            onChange={handleChange}
            name="progress_exercise"
            type="text"
          />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>Energy level</label>
        <div className="flex-1 w-full col-span-3">
          <EnergyLevel
            setValue={setEnergyLevel}
            values={["high", "moderate", "low"]}
            defaultValue="high"
          />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>notes</label>
        <div className="flex-1 w-full col-span-3">
          <Input
            value={values.progress_notes}
            onChange={handleChange}
            name="progress_notes"
            type="text"
          />
        </div>
      </div>
      <div className="w-28 ml-auto">
        <Button
          size="sm"
          variant="default"
          isLoading={isLoading}
          //@ts-ignore
          type="submit"
        >
          save
        </Button>
      </div>
    </form>
  );
}

type SelectProps = {
  values: string[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
  defaultValue?: string;
};

export function EnergyLevel({ setValue, values, defaultValue }: SelectProps) {
  return (
    <Select onValueChange={(value) => setValue(value)}>
      <SelectTrigger className="text-sm gap-2  group inline-flex items-center bg-white justify-between outline-none  h-fit  rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3">
        <SelectValue
          placeholder="pick energy level"
          defaultValue={defaultValue}
        />
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

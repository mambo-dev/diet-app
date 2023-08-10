"use client";
import { Progress } from "@prisma/client";
import React, { useState } from "react";
import { z } from "zod";
import { log_progress_schema } from "../../../lib/schemas/schemas";
import { toast } from "../../ui/toast";
import { DatePicker } from "../../ui/datepicker";
import { Input } from "../../ui/input";
import { EnergyLevel } from "./logprogress";
import Button from "../../ui/button";
import Cookies from "js-cookie";
import { edit_progress } from "../../../lib/fetch/statistics/log-progress/progress";
import Modal from "../../ui/modal";

type Props = {
  progress: Progress;
};

export default function EditProgress({ progress }: Props) {
  const [openEditProgress, setOpenEditProgress] = useState(false);
  return (
    <>
      <button
        className="w-full text-sm hover:bg-slate-300 rounded-md py-2 px-1 inline-flex items-start justify-center"
        onClick={() => setOpenEditProgress(true)}
      >
        Edit progress
      </button>
      <Modal
        title="Edit progress"
        isOpen={openEditProgress}
        setIsOpen={setOpenEditProgress}
      >
        <EditProgressForm progress={progress} />
      </Modal>
    </>
  );
}

type EditProps = {
  progress: Progress;
};

function EditProgressForm({ progress }: EditProps) {
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(energyLevel);
      const access_token = Cookies.get("access_token") ?? "";
      const validated_values = log_progress_schema.parse({
        ...values,
        progress_hips: Number(values.progress_hips),
        progress_waist: Number(values.progress_waist),
        progress_weight: Number(values.progress_weight),
        progress_energyLevel: energyLevel,
      });

      await edit_progress({
        access_token,
        progress: validated_values,
        progress_id: progress.progress_id,
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

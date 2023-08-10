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
import { Pencil } from "lucide-react";
import { buttonVariants } from "../../ui/shadbutton";
import { useRouter } from "next/navigation";

type Props = {
  progress: Progress;
};

export default function EditProgress({ progress }: Props) {
  const [openEditProgress, setOpenEditProgress] = useState(false);
  return (
    <>
      <button
        className={buttonVariants({ variant: "ghost", size: "sm" })}
        onClick={() => setOpenEditProgress(true)}
      >
        <Pencil className="w-4 h-4  text-blue-400 hover:text-blue-500" />
      </button>
      <Modal
        title="Edit progress"
        isOpen={openEditProgress}
        setIsOpen={setOpenEditProgress}
      >
        <EditProgressForm progress={progress} setIsOpen={setOpenEditProgress} />
      </Modal>
    </>
  );
}

type EditProps = {
  progress: Progress;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditProgressForm({ progress, setIsOpen }: EditProps) {
  const [date, setDate] = useState<Date | undefined>(
    new Date(`${progress.progress_date}`)
  );
  const [energyLevel, setEnergyLevel] = useState("");
  const [values, setValues] = useState<z.infer<typeof log_progress_schema>>({
    //@ts-ignore
    progress_energyLevel:
      !energyLevel && energyLevel.length <= 0
        ? progress.progress_energyLevel
        : energyLevel,
    progress_exercise: progress.progress_exercise,
    progress_hips: progress.progress_hips,
    progress_mood: progress.progress_mood,
    progress_notes: progress.progress_notes ?? "",
    progress_waist: progress.progress_waist,
    progress_weight: progress.progress_weight,
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
        progress_date: date,
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
      setIsOpen(false);

      setTimeout(() => {
        router.refresh();
      }, 500);
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

"use client";
import { DietAdherence } from "@prisma/client";
import React, { useState } from "react";
import Button, { buttonVariants } from "../../../ui/button";
import Modal from "../../../ui/modal";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../../../ui/toast";
import { z } from "zod";
import { DatePicker } from "../../../ui/datepicker";
import { Input } from "../../../ui/input";
import { edit_adherence } from "../../../../lib/fetch/statistics/log-adherence/adherence";
import Cookies from "js-cookie";
import { log_adherence_schema } from "../../../../lib/schemas/schemas";

type Props = {
  adherence: DietAdherence;
};

export default function EditAdherence({ adherence }: Props) {
  const [openEditAdherence, setOpenEditAdherence] = useState(false);
  return (
    <>
      <button
        className={buttonVariants({ variant: "ghost", size: "sm" })}
        onClick={() => setOpenEditAdherence(true)}
      >
        <Pencil className="w-4 h-4  text-blue-400 hover:text-blue-500" />
      </button>
      <Modal
        title="Edit adherence"
        isOpen={openEditAdherence}
        setIsOpen={setOpenEditAdherence}
      >
        <EditAdherenceForm
          adherence={adherence}
          setIsOpen={setOpenEditAdherence}
        />
      </Modal>
    </>
  );
}

function EditAdherenceForm({
  adherence,
  setIsOpen,
}: {
  adherence: DietAdherence;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [adherenceDate, setAdherenceDate] = useState<Date | undefined>(
    adherence.diet_adherence_date
  );
  const [adherenceStatus, setAdherenceStatus] = useState(
    adherence.diet_adherence_status
  );
  const [adherenceNotes, setAdherenceNotes] = useState(
    adherence.diet_adherence_notes ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function editAdherence(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const access_token = Cookies.get("access_token") ?? "";

      const {
        diet_adherence_date,
        diet_adherence_notes,
        diet_adherence_status,
      } = log_adherence_schema.parse({
        diet_adherence_date: adherenceDate,
        diet_adherence_status: adherenceStatus,
        diet_adherence_notes: adherenceNotes,
      });

      await edit_adherence({
        access_token,
        adherence: {
          diet_adherence_date,
          diet_adherence_notes,
          diet_adherence_status,
        },
        adherence_id: adherence.diet_adherence_id,
      });

      toast({
        message: "great thank you. Consistency is key",
        title: "Adherence logged, ",
        type: "success",
      });

      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 500);
    } catch (error) {
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
          "You did everything right - but we could not edit your adherence",
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
      onSubmit={editAdherence}
    >
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>date</label>
        <div className="flex-1 w-full col-span-3">
          <DatePicker date={adherenceDate} setDate={setAdherenceDate} />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>adhered</label>
        <div className="flex-1 w-full col-span-3">
          <input
            type="checkbox"
            className={`h-6 rounded-md w-full border border-gray-300 bg-white py-2 px-3 focus:border-green-400 accent-green-600  ring-offset-1  `}
            onChange={(e) => setAdherenceStatus(e.target.checked)}
          />
        </div>
      </div>

      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>notes</label>
        <div className="flex-1 w-full col-span-3">
          <Input
            value={adherenceNotes}
            onChange={(e) => setAdherenceNotes(e.target.value)}
            type="text"
            placeholder="ate more snacks..."
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
          update
        </Button>
      </div>
    </form>
  );
}

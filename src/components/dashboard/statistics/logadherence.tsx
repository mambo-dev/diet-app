"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { DatePicker } from "../../ui/datepicker";
import { Input } from "../../ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "../../ui/toast";
import { log_adherence_schema } from "../../../lib/schemas/schemas";
import { log_adherence } from "../../../lib/fetch/statistics/log-adherence/adherence";
import Cookies from "js-cookie";

type Props = {};

export default function LogAdherence({}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full py-2 border border-slate-300 px-2 inline-flex items-center justify-center shadow-sm bg-white rounded-lg outline-none focus:shadow text-sm font-semibold text-slate-700">
          Log adherance
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <LogAdherenceForm />
      </PopoverContent>
    </Popover>
  );
}

function LogAdherenceForm({}) {
  const [adherenceDate, setAdherenceDate] = useState<Date | undefined>(
    new Date()
  );
  const [adherenceStatus, setAdherenceStatus] = useState(false);
  const [adherenceNotes, setAdherenceNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleAdherence(e: React.FormEvent<HTMLFormElement>) {
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

      await log_adherence({
        access_token,
        adherence: {
          diet_adherence_date,
          diet_adherence_notes,
          diet_adherence_status,
        },
      });

      toast({
        message: "great thank you. Consistency is key",
        title: "adherence logged, ",
        type: "success",
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
      onSubmit={handleAdherence}
    >
      <h1>{adherenceNotes}</h1>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>date</label>
        <div className="flex-1 w-full col-span-3">
          <DatePicker date={adherenceDate} setDate={setAdherenceDate} />
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 items-start gap-3 justify-between">
        <label>followed diet plan ?</label>
        <div className="flex-1 w-full col-span-3">
          <input
            type="checkbox"
            className={`h-10 w-10 border border-gray-200 focus:border-green-400 focus:hover:ring-1 ring-green-300 ring-offset-1  `}
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
    </form>
  );
}

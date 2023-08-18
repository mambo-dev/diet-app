"use client";
import { DietAdherence } from "@prisma/client";
import React from "react";
import LogAdherence from "./logadherence";
import SaveData from "../savedata";
import { DataTable } from "../datatable";
import { adherenceColumns } from "./logadherencecolumns";

type Props = {
  adherence: DietAdherence[];
  username: string;
};

export default function Adherence({ adherence, username }: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-3" id="adherence">
      <div className="w-full justify-between mr-auto flex gap-3 items-center">
        <div className="w-fit">
          <LogAdherence />
        </div>
        <div className="w-fit">
          <SaveData data={adherence} type="adherence" username={username} />
        </div>
      </div>
      <DataTable columns={adherenceColumns} data={adherence} />
    </div>
  );
}

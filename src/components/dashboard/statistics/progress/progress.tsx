"use client";
import { Progress } from "@prisma/client";
import React from "react";
import LogProgress from "./logprogress";
import SaveData from "../savedata";
import { DataTable } from "../datatable";
import { progressColumns } from "./logprogresscolumns";

type Props = {
  progress: Progress[];
  username: string;
};

export default function Progress({ progress, username }: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-3" id="progress">
      <div className="w-full justify-between mr-auto flex gap-3 items-center">
        <div className="w-fit">
          <LogProgress />
        </div>
        <div className="w-fit">
          <SaveData data={progress} type="progress" username={username} />
        </div>
      </div>
      <DataTable columns={progressColumns} data={progress} />
    </div>
  );
}

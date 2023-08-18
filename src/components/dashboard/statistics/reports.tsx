"use client";
import { DietAdherence, Progress as ProgressType } from "@prisma/client";
import React, { useState } from "react";
import Heading from "../../ui/heading";
import Adherence from "./adherence/adherence";
import Progress from "./progress/progress";

type Props = {
  progress: ProgressType[];
  adherence: DietAdherence[];
  user: {
    user_id: number;
    username: string;
  };
};

export default function Reports({ progress, adherence, user }: Props) {
  const [currentTab, setCurrentTab] = useState<"progress" | "adherence">(
    "progress"
  );
  return (
    <>
      <div className="flex w-full items-center justify-between px-4 ">
        <Heading size="sm" className="text-slate-800">
          {currentTab === "progress" ? "Progress" : "Adherence"}
        </Heading>
        <div className="w-1/4 flex gap-3 items-center">
          <button
            onClick={() => setCurrentTab("progress")}
            className="w-full py-2 border border-slate-300 px-2 inline-flex items-center justify-center shadow-sm bg-white rounded-lg outline-none focus:shadow text-sm font-semibold text-slate-700"
          >
            Progress
          </button>
          <button
            onClick={() => setCurrentTab("adherence")}
            className="w-full py-2 border border-slate-300 px-2 inline-flex items-center justify-center shadow-sm bg-white rounded-lg outline-none focus:shadow text-sm font-semibold text-slate-700"
          >
            Adherence
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full py-2 px-4 mt-4">
        {currentTab === "progress" ? (
          <Progress username={user.username} progress={progress} />
        ) : (
          <Adherence adherence={adherence} />
        )}
      </div>
    </>
  );
}

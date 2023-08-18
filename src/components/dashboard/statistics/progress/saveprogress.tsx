"use client";
import React, { useState } from "react";
import { exportToExcel } from "../../../lib/excel";
import Button from "../../ui/button";
import { FolderDown, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Props<Tdata> {
  username: string;
  data: Tdata;
}

export default function SaveProgress<Tdata>({ username, data }: Props<Tdata>) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      //@ts-ignore
      type="button"
      className="w-full py-2   border border-slate-300 px-2 inline-flex gap-3 hover:bg-green-600 hover:text-white items-center justify-center shadow-sm bg-green-500 rounded-lg outline-none focus:shadow text-sm font-semibold text-slate-100"
      onClick={() => {
        exportToExcel({
          //@ts-ignore
          Dbdata: data,
          filename: `${username}-${format(new Date(), "T")}-progress`,
          filetype:
            "application/vnd.openxmlfromats-officedocument.spreadsheetml.sheet;charset=UTF-8",
          fileExtension: ".xlsx",
        });
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }}
    >
      {!isLoading ? (
        <FolderDown className="w-5 h-5 " />
      ) : (
        <Loader2 className="w-5 h-5 animate-spin" />
      )}
      export
    </Button>
  );
}

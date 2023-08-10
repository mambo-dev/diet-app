"use client";
import { Progress } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/shadbutton";
import { MoreHorizontal } from "lucide-react";
import EditProgress from "./editprogress";
import { toast } from "../../ui/toast";

export const columns: ColumnDef<Progress>[] = [
  {
    accessorKey: "progress_date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("progress_date");
      console.log(date);
      const formatted = format(new Date(`${date}`), "P");

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "progress_weight",
    header: "Weight (kgs)",
  },
  {
    accessorKey: "progress_waist",
    header: "Waist (cm)",
  },
  {
    accessorKey: "progress_hips",
    header: "Hips (cm)",
  },
  {
    accessorKey: "progress_energyLevel",
    header: "Energy Level",
  },
  {
    accessorKey: "progress_mood",
    header: "Mood	",
  },
  {
    accessorKey: "progress_exercise",
    header: "Exercise",
  },
  {
    accessorKey: "progress_notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = String(row.getValue("progress_notes"));

      return <div className="truncate">{notes}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const notes = String(row.getValue("progress_notes"));
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <button
                className="w-full text-sm hover:bg-slate-300 rounded-md py-2 px-1 inline-flex items-start justify-center"
                onClick={() => {
                  navigator.clipboard.writeText(String(notes));
                  toast({
                    type: "success",
                    message: "notes copied to clipboard",
                    duration: 1000,
                  });
                }}
              >
                Copy notes
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <EditProgress progress={data} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>delete progress</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

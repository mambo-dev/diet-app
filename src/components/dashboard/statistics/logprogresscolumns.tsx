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
import { Copy, MoreHorizontal } from "lucide-react";
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
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(String(notes));
              toast({
                type: "success",
                message: "notes copied to clipboard",
                duration: 1000,
              });
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <EditProgress progress={data} />
        </div>
      );
    },
  },
];

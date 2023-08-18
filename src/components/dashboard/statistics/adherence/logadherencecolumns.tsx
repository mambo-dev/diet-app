import { DietAdherence } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "../../../ui/toast";
import Button from "../../../ui/button";
import { Copy } from "lucide-react";
import EditAdherence from "./editadherence";
import DeleteAdherence from "./deleteadherence";

export const adherenceColumns: ColumnDef<DietAdherence>[] = [
  {
    accessorKey: "diet_adherence_date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("diet_adherence_date");
      const formatted = format(new Date(`${date}`), "P");

      return formatted;
    },
  },
  {
    accessorKey: "diet_adherence_status",
    header: "Adherence",
    cell: ({ row }) => {
      const status = row.getValue("diet_adherence_status");
      const displayValue = status ? "Yes" : "No";

      return (
        <div
          className={`font-semibold ${
            status ? "text-green-500" : "text-red-500"
          }`}
        >
          {displayValue}
        </div>
      );
    },
  },
  {
    accessorKey: "diet_adherence_notes",
    header: "Notes",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notes = String(row.getValue("diet_adherence_notes"));
      const data = row.original;

      return (
        <div className="flex items-center gap-1 group">
          <Button
            variant="ghost"
            size={`sm`}
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
          <EditAdherence adherence={data} />
          <DeleteAdherence adherence_id={data.diet_adherence_id} />
        </div>
      );
    },
  },
];

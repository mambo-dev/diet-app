import { DietAdherence } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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
];

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

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
  return <form></form>;
}

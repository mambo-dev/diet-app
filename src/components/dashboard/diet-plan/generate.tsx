import React from "react";
import Button from "../../ui/button";
import { Plus } from "lucide-react";

type Props = {};

export default function GenerateDietPlan({}: Props) {
  return (
    <Button
      variant="default"
      size="lg"
      className=" inline-flex items-center justify-center gap-2"
    >
      <Plus className="text-xs" /> generate
    </Button>
  );
}

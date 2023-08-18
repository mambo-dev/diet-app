import { DietAdherence } from "@prisma/client";
import React from "react";

type Props = {
  adherence: DietAdherence[];
};

export default function Adherence({ adherence }: Props) {
  return <div>Adherence</div>;
}

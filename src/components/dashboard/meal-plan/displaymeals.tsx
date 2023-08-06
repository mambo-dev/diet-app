import { Meal } from "@prisma/client";
import React from "react";

type Props = {
  meals: Meal[];
};

export default function DisplayMeals({ meals }: Props) {
  return <div>DisplayMeals</div>;
}

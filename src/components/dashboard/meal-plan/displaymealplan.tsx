"use client";
import { Meal, MealPlan } from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";
import Paragraph from "../../ui/paragraph";
import AddNewMeal from "./addnewmeal";
import { PlusCircle } from "lucide-react";
import DisplayMeals from "./displaymeals";

type Props = {
  meal_plan: MealPlan & {
    mealplan_meal: Meal[];
  };
};

export default function DisplayMealPlan({ meal_plan }: Props) {
  const [openAddNewMeal, setOpenAddNewMeal] = useState(false);
  return (
    <div className="w-full h-fit py-2 px-2  flex flex-col gap-3 items-center border border-slate-300 rounded-lg bg-white shadow">
      <div className="w-fit text-slate-800 text-sm gap-4 mr-auto flex items-center justify-between">
        <DisplayMealPlanDate date={meal_plan.mealplan_start} timeline="from" />
        <DisplayMealPlanDate date={meal_plan.mealplan_end} timeline="to" />
      </div>
      <div className="w-full py-2 flex items-center justify-between">
        <Paragraph size="sm">
          {meal_plan.mealplan_meal.length > 0
            ? "your weeks meal plans"
            : "you have no meal in your meal plan yet"}
        </Paragraph>
        <button
          type="button"
          onClick={() => setOpenAddNewMeal(!openAddNewMeal)}
          className="text-sm gap-2  group inline-flex items-center bg-white justify-center outline-none  h-fit rounded-full  rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3"
        >
          <PlusCircle className="h-5 w-5  text-slate-500 group-hover:text-slate-800  " />
          add new meal
        </button>
      </div>
      {openAddNewMeal && <AddNewMeal meal_plan={meal_plan} />}
      {meal_plan.mealplan_meal.length > 0 && (
        <DisplayMeals meals={meal_plan.mealplan_meal} />
      )}
    </div>
  );
}

function DisplayMealPlanDate({
  date,
  timeline,
}: {
  date: Date;
  timeline: "from" | "to";
}) {
  return (
    <div className="flex flex-col items-start justify-center">
      <p className=" font-medium">
        meal plan {timeline === "from" ? "from" : "to"} :
      </p>
      <span className="mr-auto">{format(new Date(`${date}`), "PPPP")}</span>
    </div>
  );
}

"use client";
import { Meal } from "@prisma/client";
import { format } from "date-fns";
import React from "react";
import Paragraph from "../../ui/paragraph";
import { db } from "../../../lib/prisma";

type Props = {
  meals: Meal[];
};

type GroupedMeals = {
  [day: string]: {
    [category: string]: Meal[];
  };
};
export default function DisplayMeals({ meals }: Props) {
  function groupedMeals(meals: Meal[]): GroupedMeals {
    const groupedMeals: GroupedMeals = {};

    meals.forEach((meal) => {
      const mealDay = format(
        new Date(`${meal.mealplan_day_of_week}`),
        "eeee"
      ).toLowerCase();

      const mealCategory = meal.meal_type
        ? meal.meal_type.toLowerCase()
        : "unassigned";

      if (!groupedMeals[mealDay]) {
        groupedMeals[mealDay] = {};
      }

      if (groupedMeals[mealDay][mealCategory]) {
        groupedMeals[mealDay][mealCategory].push(meal);
      } else {
        groupedMeals[mealDay][mealCategory] = [meal];
      }
    });

    return groupedMeals;
  }

  return (
    <div className="w-full  flex items-start gap-2 flex-col justify-center ">
      {Object.keys(groupedMeals(meals)).map((day, index) => {
        console.log(groupedMeals);
        return (
          <div
            className="w-full flex flex-col  bg-white justify-center outline-none  h-fit rounded-lg border border-slate-300   py-2 px-3 "
            key={index}
          >
            <div className="w-full flex flex-col items-center justify-between">
              <Paragraph className="mr-auto font-semibold" size="sm">
                {day}
              </Paragraph>
              <div className="grid grid-cols-6 gap-2 items-center w-full">
                {Object.keys(groupedMeals(meals)[day]).map((key) => {
                  return (
                    <>
                      {groupedMeals(meals)[day][key].map((meal) => (
                        <DisplayMeal key={meal.meal_id} meal={meal} />
                      ))}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DisplayMeal({ meal }: { meal: Meal }) {
  return (
    <div className="flex flex-col">
      <span>{meal.meal_type}</span>
    </div>
  );
}

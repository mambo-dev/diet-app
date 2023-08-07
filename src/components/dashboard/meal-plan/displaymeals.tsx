"use client";
import { Food, Meal  as DbMeal} from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";
import Paragraph from "../../ui/paragraph";
import { db } from "../../../lib/prisma";
import { Trash2 } from "lucide-react";
import DeleteMeal from "./deletemeal";
import EditMeal from "./editmeal";

type Meal = DbMeal & {
  meal_food:Food[]
}

type Props = {
  meals:Meal[];
};

type GroupedMeals = {
  [day: string]: {
    [category: string]: Meal[];
  };
};
export default function DisplayMeals({ meals }: Props) {
  function groupedMeals(meals: Meal[]): GroupedMeals {
    console.log(meals)
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
  
        return (
          <div
            className="w-full flex flex-col  bg-white justify-center outline-none  h-fit   py-2 px-3 "
            key={index}
          >
            <div className="w-full flex flex-col items-center justify-between">
              <Paragraph className="mr-auto font-semibold" size="sm">
                {day}
              </Paragraph>
              <div className="grid grid-cols-4 gap-2 items-center w-full h-fit">
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
    <div className="flex h-full flex-col rounded-lg border border-slate-300 py-2 px-2">
      <div  className="w-full flex items-center justify-between">
      <span>{meal.meal_type}</span>
      <div  className="w-fit flex items-center gap-1">
        <EditMeal meal={meal} />
        <DeleteMeal meal_id={meal.meal_id} />
      </div>
      </div>
     <span className="text-xs flex items-center" >{meal.meal_food.map((food)=>food.food_name).join(",")}</span>
    </div>
  );
}


"use client";
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { useRouter } from "next/navigation";
import { DatePicker } from "../../ui/datepicker";
import { Meal, MealPlan, MealType } from "@prisma/client";
import { toast } from "../../ui/toast";
import { SelectInput } from "../../ui/selectshad";
import { Loader2, PlusCircle, X } from "lucide-react";
import Modal from "../../ui/modal";
import SearchFood from "../food/search-food";
import Button from "../../ui/button";

import { add_meal_schema } from "../../../lib/schemas/schemas";
import { z } from "zod";
import add_new_meal from "../../../lib/fetch/mealplan/addnewMeal";

type Props = {
  meal_plan: MealPlan & {
    mealplan_meal: Meal[];
  };
};

export default function AddNewMeal({ meal_plan }: Props) {
  const [mealType, setMealType] = useState<string>("breakfast");
  const [mealPlanDayOfWeek, setMealPlanDayOfWeek] = useState<Date | undefined>(
    new Date()
  );
  const [openFoodSearch, setOpenFoodSearch] = useState(false);
  const [foods, setFoods] = useState<{ food_name: string; food_id: string }[]>(
    []
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function addNewMeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { food_items_ids, meal_type, meal_day_of_week } =
        add_meal_schema.parse({
          food_items_ids: foods.map((foods) => {
            return foods.food_id;
          }),
          meal_type: mealType,
          meal_day_of_week: String(mealPlanDayOfWeek),
        });

      await add_new_meal({
        food_items_ids,
        meal_day_of_week,
        meal_type: meal_type,
      });

      toast({
        title: "Success",
        message: "meal added",
        type: "success",
      });

      setFoods([]);
      setMealType("");

      setTimeout(() => {
        router.refresh();
      }, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.issues);
        error.issues.forEach((issue) => {
          toast({
            title: "Invalid inputs",
            message: issue.message,
            type: "error",
          });
        });
        return;
      }
      toast({
        title: "Server Error",
        message: "failed to add meal",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="w-full flex-col flex items-center gap-2">
        <form
          onSubmit={addNewMeal}
          className="w-full py-2 flex flex-col gap-3 items-center"
        >
          <div className="w-full grid grid-cols-3 gap-3">
            <SelectInput
              setValue={setMealType}
              values={["breakfast", "lunch", "dinner", "snacks"]}
            />
            <DatePicker
              date={mealPlanDayOfWeek}
              setDate={setMealPlanDayOfWeek}
              fromDate={meal_plan.mealplan_start}
              toDate={meal_plan.mealplan_end}
            />
            <button
              type="button"
              onClick={() => setOpenFoodSearch(true)}
              className="text-sm gap-2  group inline-flex items-center bg-white justify-center outline-none  h-fit   rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3"
            >
              <PlusCircle className="h-5 w-5  text-slate-500 group-hover:text-slate-800  " />
              Add food to meal
            </button>
          </div>
          <div className="w-full grid grid-cols-3 gap-3">
            {foods.map((food, index) => {
              return (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3 "
                >
                  {food.food_name}
                  <RemoveFoodFromMeal
                    setFoods={setFoods}
                    food_id={food.food_id}
                  />
                </div>
              );
            })}
          </div>
          <div className="w-fit ml-auto">
            {" "}
            <Button
              variant="default"
              size="default"
              className="mt-2"
              //@ts-ignore
              type="submit"
              isLoading={isLoading}
            >
              add meal
            </Button>
          </div>
        </form>
      </div>
      <Modal
        setIsOpen={setOpenFoodSearch}
        isOpen={openFoodSearch}
        title="search foods"
      >
        <SearchFood type="mealplan" setFoodsMealPlan={setFoods} />
      </Modal>
    </>
  );
}

export function RemoveFoodFromMeal({
  food_id,
  setFoods,
}: {
  food_id: string;
  setFoods: React.Dispatch<
    React.SetStateAction<
      {
        food_name: string;
        food_id: string;
      }[]
    >
  >;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setIsLoading(true);
        setFoods((foods) => {
          return foods.filter((food) => food.food_id !== food_id);
        });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }}
      className="group inline-flex items-center justify-center outline-none w-fit h-fit rounded-full"
    >
      {isLoading ? (
        <Loader2 className=" h-6 w-6 animate-spin" />
      ) : (
        <X className="h-6 w-6  text-red-300 hover:text-red-500  " />
      )}
    </button>
  );
}

"use client";
import { Food, Meal } from "@prisma/client";
import React, { useState } from "react";
import { add_meal_schema } from "../../../lib/schemas/schemas";
import { toast } from "../../ui/toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Modal from "../../ui/modal";
import { Pencil, PlusCircle } from "lucide-react";
import { SelectInput } from "../../ui/selectshad";
import { DatePicker } from "../../ui/datepicker";
import { RemoveFoodFromMeal } from "./addnewmeal";
import Button from "../../ui/button";
import SearchFood from "../food/search-food";
import edit_meal from "../../../lib/fetch/mealplan/editMeal";

type Props = {
  meal: Meal & {
    meal_food: Food[];
  };
};

export default function EditMeal({ meal }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [mealType, setMealType] = useState<string>(String(meal.meal_type));
  const [mealPlanDayOfWeek, setMealPlanDayOfWeek] = useState<Date | undefined>(
    new Date(`${meal.mealplan_day_of_week}`)
  );
  const [openFoodSearch, setOpenFoodSearch] = useState(false);
  const [foods, setFoods] = useState<{ food_name: string; food_id: string }[]>(
    []
  );
  const router = useRouter();

  async function editMeal(
    e: React.FormEvent<HTMLFormElement>,
    meal_id: number
  ) {
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

      await edit_meal(
        {
          food_items_ids,
          meal_day_of_week,
          meal_type: meal_type,
        },
        meal_id
      );

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
      console.log(error);
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
        message: "failed to edit meal",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenEdit(true)}
        className=" group inline-flex items-center justify-center outline-none  h-fit rounded-full"
      >
        <Pencil className="h-4 w-4  text-slate-600 group-hover:text-blue-500  " />
      </button>
      <Modal
        size="max-w-4xl"
        title="edit meal"
        isOpen={openEdit}
        setIsOpen={setOpenEdit}
      >
        <div className="w-full flex-col flex items-center gap-2">
          <form
            onSubmit={(e) => editMeal(e, meal.meal_id)}
            className="w-full py-2 flex flex-col gap-3 items-center"
          >
            <div className="w-full grid grid-cols-3 gap-3">
              <SelectInput
                setValue={setMealType}
                values={["breakfast", "lunch", "dinner", "snacks"]}
                defaultValue={String(meal.meal_type)}
              />
              <DatePicker
                date={mealPlanDayOfWeek}
                setDate={setMealPlanDayOfWeek}
              />
              <button
                type="button"
                onClick={() => setOpenFoodSearch(!openFoodSearch)}
                className="text-sm gap-2  group inline-flex items-center bg-white justify-center outline-none  h-fit   rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3"
              >
                <PlusCircle className="h-5 w-5  text-slate-500 group-hover:text-slate-800  " />
                Add new foods to meal
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
                update meal
              </Button>
            </div>
          </form>
          {openFoodSearch && (
            <div className="w-full">
              <SearchFood type="mealplan" setFoodsMealPlan={setFoods} />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

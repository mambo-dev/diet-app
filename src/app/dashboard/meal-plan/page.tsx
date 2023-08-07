import React from "react";
import get_meal_plan from "../../../lib/fetch/mealplan/get";
import { FolderPlus } from "lucide-react";
import EmptyState from "../../../components/ui/empty";
import GenerateMealPlan from "../../../components/dashboard/meal-plan/generatemealplan";
import Heading from "../../../components/ui/heading";
import DisplayMealPlan from "../../../components/dashboard/meal-plan/displaymealplan";

type Props = {};

export default async function MealPlanPage({}: Props) {
  const { data } = await get_meal_plan();
  return (
    <div className="flex py-10 w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between px-4 ">
        <Heading size="sm" className="text-slate-800">
          Meal plan
        </Heading>
        {!data && (
          <div className="w-32">
            <GenerateMealPlan />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full py-2 px-4">
        {!data ? (
          <EmptyState
            action={<GenerateMealPlan />}
            icon={<FolderPlus className=" w-14 h-14 " />}
            title="No Meal plan"
            subTitle="Set a meal plan for the week"
          />
        ) : (
          <DisplayMealPlan meal_plan={data} />
        )}
      </div>
    </div>
  );
}

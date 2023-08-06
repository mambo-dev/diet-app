import "server-only";
import { Meal, MealPlan } from "@prisma/client";
import { HandleError, ServerResponse } from "../../type";
import { cookies } from "next/headers";

export default async function get_meal_plan(): Promise<{
  data?:
    | MealPlan & {
        mealplan_meal: Meal[];
      };

  error?: HandleError | HandleError[];
}> {
  const cookie = cookies();

  const access_token = cookie.get("access_token");

  const res = await fetch(`http://localhost:3000/api/meal-plan/get-meal-plan`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token?.value}`,
    },
    credentials: "include",
  });

  const data = (await res.json()) as ServerResponse<{
    data?:
      | (MealPlan & {
          mealplan_meal: Meal[];
        })
      | null;
  }>;

  if (data.error && !data.data) {
    if (data.error instanceof Array) {
      return {
        error: data.error,
      };
    }

    return {
      error: {
        message: data.error ?? "something unexpected happened",
      },
    };
  }

  return {
    //@ts-expect-error
    data: data.data,
  };
}

import "server-only";
import { DietPlan, Food } from "@prisma/client";
import { HandleError, ServerResponse } from "../../type";
import { cookies } from "next/headers";

export default async function get_diet_plan(): Promise<{
  data?: DietPlan & {
    diet_plan_food: Food[];
  };
  error?: HandleError | HandleError[];
}> {
  const cookie = cookies();

  const access_token = cookie.get("access_token");

  const res = await fetch(`http://localhost:3000/api/diet-plan/get-diet-plan`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token?.value}`,
    },
    credentials: "include",
  });

  const data = (await res.json()) as ServerResponse<{
    data?: DietPlan & {
      diet_plan_food: Food[];
    };
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

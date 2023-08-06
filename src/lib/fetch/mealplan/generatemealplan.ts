import { HandleError, ServerResponse } from "../../type";

export default async function generate_meal_plan(): Promise<{
  data?: boolean;
  error?: HandleError | HandleError[];
}> {
  const res = await fetch(
    `http://localhost:3000/api/meal-plan/generate-meal-plan`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    }
  );

  const data = (await res.json()) as ServerResponse<{
    data?: boolean;
    error?: HandleError | HandleError[];
  }>;

  console.log("error from generate", data);
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
  //@ts-expect-error
  return data.data;
}

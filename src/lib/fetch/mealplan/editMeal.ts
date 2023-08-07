import { ServerResponse } from "../../type";

interface EditMeal {
  food_items_ids: string[];
  meal_type: "breakfast" | "lunch" | "dinner" | "snacks";
  meal_day_of_week: Date;
}

export default async function edit_meal(editMeal: EditMeal, meal_id:number) {
    console.log("here")
  const res = await fetch(`/api/meal-plan/meal/edit-meal?meal_id=${meal_id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      // Cookie: `access_token=${access_token}`,
    },
    body: JSON.stringify(editMeal),
    credentials: "include",
  });

  const data = (await res.json()) as ServerResponse<boolean>;
  console.log("here")
  if (data.error && !data.data) {
    console.log(data.error);
    throw new Error("something went wrong");
  }

  return data.data;
}

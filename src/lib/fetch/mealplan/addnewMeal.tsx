import { ServerResponse } from "../../type";

interface NewMeal {
  food_items_ids: string[];
  meal_type: "breakfast" | "lunch" | "dinner" | "snacks";
  meal_day_of_week: Date;
}

export default async function add_new_meal(newMeal: NewMeal) {
  const res = await fetch(`http://localhost:3000/api/meal-plan/meal/add-meal`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      // Cookie: `access_token=${access_token}`,
    },
    body: JSON.stringify(newMeal),
    credentials: "include",
  });

  const data = (await res.json()) as ServerResponse<boolean>;
  if (data.error && !data.data) {
    console.log(data.error);
    throw new Error("something went wrong");
  }

  return data.data;
}

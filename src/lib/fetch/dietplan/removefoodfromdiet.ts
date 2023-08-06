import { ServerResponse } from "../../type";

export default async function remove_food_from_diet(removeParams: {
  access_token: string;
  food_id: number;
}) {
  const res = await fetch(
    `http://localhost:3000/api/food/remove-food-from-plan?food_id=${removeParams.food_id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Cookie: `access_token=${removeParams.access_token}`,
      },

      credentials: "include",
    }
  );

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    console.log(data.error);
    throw new Error("so wrong");
  }

  return data.data;
}

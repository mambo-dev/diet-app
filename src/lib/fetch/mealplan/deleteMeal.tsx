import { ServerResponse } from "../../type";

export default async function delete_meal(access_token: string, meal_id:number) {
  const res = await fetch(`/api/meal-plan/meal/delete-meal?meal_id=${meal_id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token}`,
    },

    credentials: "include",
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    console.log(data.error);
    throw new Error("something went wrong");
  }

  return data.data;
}

import { FoodData } from "../type";

export default async function get_food(id: string): Promise<FoodData> {
  const response = await fetch(
    `https://trackapi.nutritionix.com/v2/search/item?nix_item_id=${id}`,
    {
      headers: {
        "x-app-id": "7d3f52b1",
        "x-app-key": "0d283ce7e96e689cfbcf082bf0eeb56f",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("food not found in api database invalid id provided");
  }

  const food_data = (await response.json()).foods[0] as FoodData;

  return food_data;
}

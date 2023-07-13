import { Food } from "@prisma/client";
import { db } from "../prisma";
import { FoodData } from "../type";

export default async function find_food(id: string): Promise<Food | null> {
  const food = await db.food.findUnique({
    where: {
      food_nix_api_id: id,
    },
  });

  if (!food) {
    return null;
  }

  return food;
}

import { Food } from "@prisma/client";
import { db } from "../prisma";
import { FoodData } from "../type";

export default async function find_food(id: string): Promise<Food> {
  const food = await db.food.findUnique({
    where: {
      food_nix_api_id: id,
    },
  });

  if (!food) {
    throw new Error("could not find food");
  }

  return food;
}

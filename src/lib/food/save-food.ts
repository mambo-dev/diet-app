import { db } from "../prisma";
import { FoodData } from "../type";

export default async function save_food(food_data: FoodData, user_id: number) {
  try {
    await db.food.create({
      data: {
        food_calories: food_data.nf_calories,
        food_carbohydrates: food_data.nf_total_carbohydrate,
        food_fats: food_data.nf_total_fat,
        food_name: food_data.food_name,
        food_nix_api_id: food_data.nix_item_id,
        food_proteins: food_data.nf_protein,
        food_diet_plan: {
          connect: {
            dietplan_user_id: user_id,
          },
        },
      },
    });

    return true;
  } catch (error) {
    throw new Error("could not save food");
  }
}

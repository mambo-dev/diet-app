// send the food id using a search api on the front end then add the food to you database

import { NextResponse } from "next/server";
import { FoodData, HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import verifyAuth from "../../../../lib/auth";
import { z } from "zod";
import { db } from "../../../../lib/prisma";

export const addFoodSchema = z.object({
  id: z.string().min(1, "the food id should be provided"),
});

export async function POST(request: Request): Promise<
  NextResponse<{
    data?: boolean;
    error?: HandleError | HandleError[] | null;
  }>
> {
  try {
    // get user authentication status

    const cookie = cookies();
    const body = await request.json();

    const access_token = cookie.get("access_token");

    if (!cookie) {
      return NextResponse.json(
        {
          error: {
            message: "could not retrive cookies",
          },
        },
        { status: 400 }
      );
    }

    const { user, error } = await verifyAuth(access_token?.value);

    if (error || !user) {
      return NextResponse.json(
        {
          error: {
            message: error,
          },
        },
        { status: 403 }
      );
    }

    const diet_plan_exists = await db.dietPlan.findUnique({
      where: {
        dietplan_user_id: user.user_id,
      },
    });

    if (!diet_plan_exists) {
      return NextResponse.json(
        {
          error: {
            message: "kindly create a diet plan first",
          },
        },
        { status: 200 }
      );
    }

    const { id } = addFoodSchema.parse(body);

    const check_food_existence = await db.food.findUnique({
      where: {
        food_nix_api_id: id,
      },
    });

    //food exists in our db connect to diet plan
    if (check_food_existence) {
      await db.food.update({
        where: {
          food_id: check_food_existence.food_id,
        },
        data: {
          food_diet_plan: {
            connect: {
              dietplan_user_id: user.user_id,
            },
          },
        },
      });

      return NextResponse.json(
        {
          data: true,
        },
        { status: 200 }
      );
    }

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
      throw new Error("food not found in database invalid id provided");
    }

    const food_data = (await response.json()) as FoodData;
    //add and connect to diet plan
    await db.food.create({
      data: {
        food_calories: food_data.nf_calories,
        food_carbohydrates: food_data.nf_total_carbohydrate,
        food_fats: food_data.nf_total_fat,
        food_name: food_data.food_name,
        food_nix_api_id: food_data.food_nix_api_id,
        food_proteins: food_data.nf_protein,
        food_diet_plan: {
          connect: {
            dietplan_user_id: user.user_id,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: "something went wrong with the server",
        },
      },
      {
        status: 500,
      }
    );
  }
}

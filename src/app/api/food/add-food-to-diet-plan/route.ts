// send the food id using a search api on the front end then add the food to you database

import { NextResponse } from "next/server";
import { FoodData, HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import verifyAuth from "../../../../lib/auth";
import { z } from "zod";
import { db } from "../../../../lib/prisma";

import get_food from "../../../../lib/food/fetch-food";
import save_food from "../../../../lib/food/save-food";

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

    const food_data = await get_food(id);
    //add and connect to diet plan
    await save_food(food_data, user.user_id);

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

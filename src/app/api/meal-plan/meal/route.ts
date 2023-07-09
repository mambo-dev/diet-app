import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { z } from "zod";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";
import { HandleError } from "../../../../lib/type";
import find_food from "../../../../lib/food/find-food";
import get_food from "../../../../lib/food/fetch-food";
import save_food from "../../../../lib/food/save-food";

export const create_meal_schema = z.object({
  food_items_ids: z.array(z.string().min(1, "please provide a food id ")),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snacks"]),
});

export async function POST(request: Request): Promise<
  NextResponse<{
    data?: boolean;
    error?: HandleError | HandleError[] | z.ZodIssue[];
  }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const cookie = cookies();
    const body = await request.json();
    const meal_id = searchParams.get("meal_id");

    if (!meal_id || isNaN(Number(meal_id))) {
      throw new Error("invalid id value sent");
    }

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

    const find_user_diet_plan = await db.dietPlan.findUnique({
      where: {
        dietplan_user_id: user.user_id,
      },
      include: {
        dietplan_meal_plan: true,
      },
    });

    if (!find_user_diet_plan) {
      return NextResponse.json(
        {
          error: {
            message: "could not find a diet plan associated with this user",
          },
        },
        { status: 404 }
      );
    }

    if (!find_user_diet_plan.dietplan_meal_plan) {
      return NextResponse.json(
        {
          error: {
            message: "could not find a meal plan try generating one first",
          },
        },
        { status: 404 }
      );
    }

    const { food_items_ids, meal_type } = create_meal_schema.parse(body);

    /**
     * @FIXME change implementaion of meal creation and adding
     * @TODO find put why its not working as it should
     */
    food_items_ids.forEach(async (id) => {
      //check availability of the food
      const food = await find_food(id);
      if (!food) {
        const food_from_api = await get_food(id);
        const new_food = await save_food(food_from_api, user.user_id);

        await db.meal.update({
          where: {
            meal_id: Number(meal_id),
          },
          data: {
            meal_type,
            meal_food: {
              connect: {
                food_id: new_food.food_id,
              },
            },
          },
        });
      } else {
        const food_to_add = await find_food(id);
        await db.meal.update({
          where: {
            meal_id: Number(meal_id),
          },
          data: {
            meal_type,
            meal_food: {
              connect: {
                food_id: food_to_add.food_id,
              },
            },
          },
        });
      }
    });

    return NextResponse.json(
      {
        data: true,
      },
      { status: 200 }
    );
  } catch (error) {
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

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { Meal, MealPlan } from "@prisma/client";
import { z } from "zod";
import { HandleError } from "../../../../../lib/type";
import verifyAuth from "../../../../../lib/auth";
import { db } from "../../../../../lib/prisma";
import find_food from "../../../../../lib/food/find-food";
import get_food from "../../../../../lib/food/fetch-food";
import save_food from "../../../../../lib/food/save-food";
import { add_meal_schema } from "../../../../../lib/schemas/schemas";

export async function POST(request: Request): Promise<
  NextResponse<{
    data?: boolean;
    error?: HandleError | HandleError[] | null;
  }>
> {
  try {
    // get user authentication status
    const body = await request.json();
    const cookie = cookies();

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

    // a meal plan is a week long commitment so we need to get all meal plan associated with a date
    // this is what the client will send to the server the end date of the meal plan
    // @TODO mealplans will be delete after the end date so  we add a background worker for this
    // return meal plan associated to the user diet and confirm not expired

    const find_user_current_meal_plan = await db.mealPlan.findUnique({
      where: {
        mealplan_diet_plan_id: find_user_diet_plan.dietplan_id,
      },
      include: {
        mealplan_meal: {
          include: {
            meal_food: true,
          },
        },
      },
    });

    if (!find_user_current_meal_plan) {
      return NextResponse.json(
        {
          error: {
            message: "could not find meal plan",
          },
        },
        {
          status: 404,
        }
      );
    }

    const { food_items_ids, meal_type, meal_day_of_week } =
      add_meal_schema.parse(body);

    food_items_ids.forEach(async (id) => {
      const food = await find_food(id);
      if (!food) {
        const food_from_api = await get_food(id);
        const new_food = await save_food(food_from_api, user.user_id);

        await db.meal.create({
          data: {
            meal_meal_plan: {
              connect: {
                mealplan_id: find_user_current_meal_plan.mealplan_id,
              },
            },
            meal_type,
            meal_food: {
              connect: {
                food_id: new_food.food_id,
              },
            },
            mealplan_day_of_week: meal_day_of_week,
          },
        });
      } else {
        await db.meal.create({
          data: {
            meal_meal_plan: {
              connect: {
                mealplan_id: find_user_current_meal_plan.mealplan_id,
              },
            },
            meal_type,
            meal_food: {
              connect: {
                food_id: food.food_id,
              },
            },
            mealplan_day_of_week: meal_day_of_week,
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

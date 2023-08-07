import { NextResponse } from "next/server";
import { HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";
import { Meal, MealPlan } from "@prisma/client";

export async function GET(request: Request): Promise<
  NextResponse<{
    data?:
      | (MealPlan & {
          mealplan_meal: Meal[];
        })
      | null;
    error?: HandleError | HandleError[] | null;
  }>
> {
  try {
    // get user authentication status

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
          orderBy:{
            mealplan_day_of_week:"asc"
          },
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
    /**
     * @TODO change database schema for the meal plan relation with user
     */

    return NextResponse.json(
      {
        data: find_user_current_meal_plan,
      },
      { status: 200 }
    );
  } catch (error) {
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

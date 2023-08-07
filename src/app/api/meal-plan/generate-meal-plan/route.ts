import { NextResponse } from "next/server";
import { HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";
import { eachDayOfInterval, addDays } from "date-fns";

export async function GET(request: Request): Promise<
  NextResponse<{
    data?: boolean;
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

    const user_has_mealplan = await db.mealPlan.findUnique({
      where: {
        mealplan_diet_plan_id: find_user_diet_plan.dietplan_id,
      },
    });

    if (user_has_mealplan) {
      const currentDate = new Date();
      const meal_plan_is_active =
        currentDate > new Date(user_has_mealplan.mealplan_end) ? false : true;

      if (meal_plan_is_active) {
        return NextResponse.json(
          {
            error: {
              message:
                "cannot generate new meal plan while meal plan is active delete current meal plan",
            },
          },
          { status: 403 }
        );
      }
    }

 

    // generate a meal for each meal plus snacks

   
    await db.mealPlan.create({
      data: {
        mealplan_start: addDays(new Date(), 1),
        mealplan_end: addDays(new Date(), 7),
        mealplan_diet_plan: {
          connect: {
            dietplan_id: find_user_diet_plan.dietplan_id,
          },
        },
        mealplan_user: {
          connect: {
            user_id: user.user_id,
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

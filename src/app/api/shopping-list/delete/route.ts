import { NextResponse } from "next/server";
import { HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";

export async function DELETE(request: Request): Promise<
  NextResponse<{
    data?: boolean;
    error?: HandleError | HandleError[] | null;
  }>
> {
  try {
    const cookie = cookies();

    const access_token = cookie.get("access_token");
    const { searchParams } = new URL(request.url);
    const shopping_list_id = searchParams.get("shopping_list_id");

    if (!shopping_list_id || isNaN(Number(shopping_list_id))) {
      throw new Error("invalid id value sent");
    }

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
          error: [
            {
              message: "please generate a diet plan to continue",
            },
          ],
        },
        {
          status: 403,
        }
      );
    }
    const currentDate = new Date();

    const current_meal_plan = find_user_diet_plan.dietplan_meal_plan.find(
      (meal_plan) => new Date(meal_plan.mealplan_end) >= currentDate
    );

    if (!current_meal_plan) {
      return NextResponse.json(
        {
          error: [
            {
              message: "oops seems like all your meal plans have expired",
            },
          ],
        },
        {
          status: 403,
        }
      );
    }

    await db.shoppingList.delete({
      where: {
        shopping_list_id: Number(shopping_list_id),
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
        error: [
          {
            message: "something went wrong with the server",
          },
        ],
      },
      {
        status: 500,
      }
    );
  }
}

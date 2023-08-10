import { NextResponse } from "next/server";
import { HandleError } from "../../../../lib/type";
import { z } from "zod";
import { cookies } from "next/headers";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";

export const edit_shopping_list = z.object({
  ingridient_items: z
    .array(z.string().min(1, "please provide the food item"))
    .nonempty("you should have atleast one food item "),
  shopping_list_id: z.string().transform((value) => Number(value)),
});

export async function PUT(request: Request): Promise<
  NextResponse<{
    data?: boolean;
    error?: HandleError | HandleError[] | null;
  }>
> {
  try {
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

    const { ingridient_items, shopping_list_id } =
      edit_shopping_list.parse(body);

    const shopping_list_items = await db.shoppingList.findUnique({
      where: {
        shopping_list_id,
      },
    });

    if (!shopping_list_items) {
      return NextResponse.json(
        {
          error: [
            {
              message: "could not find shopping list",
            },
          ],
        },
        {
          status: 500,
        }
      );
    }

    await db.shoppingList.update({
      where: {
        shopping_list_id,
      },
      data: {
        shopping_list_ingridients: [
          ...shopping_list_items.shopping_list_ingridients,
          ...ingridient_items,
        ],
      },
    });

    return NextResponse.json(
      {
        data: true,
      },
      { status: 200 }
    );
  } catch (error) {
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

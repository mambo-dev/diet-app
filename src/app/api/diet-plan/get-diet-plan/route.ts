import { NextResponse } from "next/server";
import { HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";
import { DietPlan, Food } from "@prisma/client";

export async function GET(request: Request): Promise<
  NextResponse<{
    data?: DietPlan & {
      diet_plan_food: Food[];
    };
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
    const get_user_diet_plan = await db.dietPlan.findUnique({
      where: {
        dietplan_user_id: user.user_id,
      },
      include: {
        diet_plan_food: true,
      },
    });

    if (!get_user_diet_plan) {
      return NextResponse.json(
        {
          error: {
            message: "could not find users diet plan kindly generate one ",
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: get_user_diet_plan,
      },
      { status: 200 }
    );
  } catch (error: any) {
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

import { cookies } from "next/headers";
import { HandleError } from "../../../../lib/type";
import { NextResponse } from "next/server";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";

export async function DELETE(request: Request): Promise<
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

    await db.dietPlan.delete({
      where: {
        dietplan_id: find_user_diet_plan.dietplan_id,
      },
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

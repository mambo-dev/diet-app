import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import verifyAuth from "../../../../../lib/auth";
import { db } from "../../../../../lib/prisma";
import { HandleError } from "../../../../../lib/type";

export const signUpSchema = z.object({
  food_nix_id: z.string().min(1, "please provide a username"),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snacks"]),
});

export async function POST(request: Request): Promise<
  NextResponse<{
    data?: boolean;
    error?: HandleError | HandleError[] | z.ZodIssue[];
  }>
> {
  try {
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

import { DietPlan } from "@prisma/client";
import { HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import verifyAuth from "../../../../lib/auth";

export async function GET(request: Request): Promise<
  NextResponse<{
    data?: DietPlan | null;
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

    //calculate bmr
    //calculate food percentages
    //create meal plan

    //save to database

    return NextResponse.json(
      {
        data: null,
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

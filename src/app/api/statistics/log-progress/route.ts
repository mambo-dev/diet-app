import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HandleError } from "../../../../lib/type";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";
import { log_progress_schema } from "../../../../lib/schemas/schemas";

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
            message:
              "you need to generate atleast a diet plan to log your progress",
          },
        },
        { status: 404 }
      );
    }

    const {
      progress_date,
      progress_energyLevel,
      progress_exercise,
      progress_hips,
      progress_mood,
      progress_notes,
      progress_weight,
      progress_waist,
    } = log_progress_schema.parse(body);

    await db.progress.create({
      data: {
        progress_date,
        progress_energyLevel,
        progress_exercise,
        progress_hips,
        progress_mood,
        progress_notes,
        progress_weight,
        progress_waist,
        progress_user: {
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

export async function PUT(request: Request): Promise<
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
    const { searchParams } = new URL(request.url);
    const progress_id = searchParams.get("progress_id");

    if (!progress_id || isNaN(Number(progress_id))) {
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
          error: {
            message:
              "you need to generate atleast a diet plan to log your progress",
          },
        },
        { status: 404 }
      );
    }

    const progress = log_progress_schema.parse(body);

    await db.progress.update({
      where: {
        progress_id: Number(progress_id),
      },
      data: {
        ...progress,
        progress_user: {
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
    const progress_id = searchParams.get("progress_id");

    if (!progress_id || isNaN(Number(progress_id))) {
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

    await db.progress.delete({
      where: {
        progress_id: Number(progress_id),
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

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HandleError } from "../../../../lib/type";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";
import {
  log_adherence_schema,
  log_progress_schema,
} from "../../../../lib/schemas/schemas";

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
              "you need to generate atleast a diet plan to log your adherence",
          },
        },
        { status: 404 }
      );
    }

    const {
      diet_adherance_notes,
      diet_adherence_adhered,
      diet_adherence_date,
    } = log_adherence_schema.parse(body);

    await db.dietAdherence.create({
      data: {
        diet_adherence_adhered,
        diet_adherance_notes,
        diet_adherence_date,
        diet_adherance_user: {
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
    const adherence_id = searchParams.get("adherence_id");

    if (!adherence_id || isNaN(Number(adherence_id))) {
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

    const {
      diet_adherance_notes,
      diet_adherence_adhered,
      diet_adherence_date,
    } = log_adherence_schema.parse(body);

    await db.dietAdherence.update({
      where: {
        diet_adherence_id: Number(adherence_id),
      },
      data: {
        diet_adherence_adhered,
        diet_adherance_notes,
        diet_adherence_date,
        diet_adherance_user: {
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
    const adherence_id = searchParams.get("adherence_id");

    if (!adherence_id || isNaN(Number(adherence_id))) {
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

    await db.dietAdherence.delete({
      where: {
        diet_adherence_id: Number(adherence_id),
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

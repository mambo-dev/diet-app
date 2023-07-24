import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import verifyAuth from "../../../lib/auth";
import { cookies } from "next/headers";
import { db } from "../../../lib/prisma";
import { BioData } from "@prisma/client";
import { HandleError } from "../../../lib/type";

export const bioDataSchema = z.object({
  age: z
    .string()
    .min(1, "please provide your age")
    .transform((val) => Number(val)),
  gender: z.enum(["male", "female"]),
  desired_calorie_intake: z
    .string()
    .min(1, "please provide your desired calorie intake")
    .transform((val) => Number(val)),
  carbohydrates_ratio: z
    .string()
    .min(1, "please provide your desired carbohydrates ratio")
    .transform((val) => Number(val)),
  proteins_ratio: z
    .string()
    .min(1, "please provide your desired proteins ratio")
    .transform((val) => Number(val)),
  fats_ratio: z
    .string()
    .min(1, "please provide your desired  fats ratio")
    .transform((val) => Number(val)),
  weight: z
    .string()
    .min(1, "please provide your weight")
    .transform((val) => Number(val)),
  height: z
    .string()
    .min(1, "please provide your height")
    .transform((val) => Number(val)),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ]),
  goals: z.array(z.string()).nonempty(),
});

export async function POST(request: Request): Promise<Response> {
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

    const body = await request.json();

    const {
      age,
      gender,
      weight,
      height,
      goals,
      activityLevel,
      desired_calorie_intake,
      carbohydrates_ratio,
      fats_ratio,
      proteins_ratio,
    } = bioDataSchema.parse(body);

    await db.bioData.update({
      where: {
        biodata_user_id: user.user_id,
      },
      data: {
        biodata_age: age,
        biodata_gender: gender,
        biodata_weight: weight,
        biodata_height: height,
        biodata_activity: activityLevel,
        biodata_goals: goals,
        biodata_desired_calorie: desired_calorie_intake,
        biodata_carbohydrates_ratio: carbohydrates_ratio,
        biodata_fats_ratio: fats_ratio,
        biodata_proteins_ratio: proteins_ratio,
      },
    });

    return NextResponse.json({ data: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors.map((error) => {
            return {
              message: error.message,
            };
          }),
        },
        { status: 403 }
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

export async function GET(request: Request): Promise<
  NextResponse<{
    data?: BioData;
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

    const user_biodata = await db.bioData.findUnique({
      where: {
        biodata_user_id: user.user_id,
      },
    });

    if (!user_biodata) {
      return NextResponse.json(
        {
          error: {
            message: "could not find user bio data",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: user_biodata,
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

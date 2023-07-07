import { DietPlan } from "@prisma/client";
import { HandleError } from "../../../../lib/type";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import verifyAuth from "../../../../lib/auth";
import { db } from "../../../../lib/prisma";
import generate_bmr from "../../../../lib/diet-plan/bmrcreation";
import generate_macro_nutrients from "../../../../lib/diet-plan/generatecalories";
import generateMealPlan from "../../../../lib/diet-plan/getdietplan";

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

    const bio_data = await db.bioData.findUnique({
      where: {
        biodata_user_id: user.user_id,
      },
    });
    if (!bio_data) {
      throw new Error("bio data was not created");
    }

    const isBioDataUpdated = Object.values(bio_data).some((value) => {
      if (typeof value === "number") {
        return value > 0;
      } else if (typeof value === "string") {
        return value.trim().length > 0;
      } else {
        return value.length > 0;
      }
    });

    if (!bio_data) {
      throw new Error("bio data was not created");
    }

    if (!isBioDataUpdated) {
      return NextResponse.json(
        {
          error: {
            message:
              "kindly update your bio data information to generate diet plan",
          },
        },
        {
          status: 403,
        }
      );
    }

    //calculate bmr
    const user_calorie_intake = await generate_bmr({
      height: bio_data.biodata_height,
      weight: bio_data.biodata_weight,
      age: bio_data.biodata_age,
      activity_level: bio_data.biodata_activity,
      gender: bio_data.biodata_gender,
    });
    //calculate food percentages

    const generate_macro_nutrient = await generate_macro_nutrients({
      calorie_intake: user_calorie_intake,
      carbohydrate_percentage: bio_data.biodata_carbohydrates_ratio,
      proteins_percentage: bio_data.biodata_proteins_ratio,
      fats_percentage: bio_data.biodata_fats_ratio,
    });

    //create meal plan

    const meal_plan = await generateMealPlan(user_calorie_intake);

    //save to database

    // const saveUserDietPlan = await db.userDietPlan.create({
    //     data:{
    //        userdietplan_user:{
    //         connect:{

    //         }
    //        }
    //     }
    // })

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

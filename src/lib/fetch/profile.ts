import { cookies } from "next/headers";
import { bioDataSchema } from "../schemas/schemas";
import { ServerResponse } from "../type";

interface IBioData {
  age: number;
  gender: "male" | "female";
  desired_calorie_intake: number;
  carbohydrates_ratio: number;
  proteins_ratio: number;
  fats_ratio: number;
  weight: number;
  height: number;
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
  goals: string[];
}

export default async function update_bio_data(
  BioData: IBioData,
  access_token: string
): Promise<boolean | undefined> {
  console.log("do we hit");
  const res = await fetch(`/api/user`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token}`,
    },
    body: JSON.stringify(BioData),
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }
  return data.data;
}

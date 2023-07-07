interface IGenerateBmr {
  height: number;
  weight: number;
  age: number;
  gender: "male" | "female";
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
}

//height, weight, age, gender, activity level

export default function generate_bmr({
  height,
  weight,
  age,
  gender,
  activity_level,
}: IGenerateBmr) {
  let bmr: number;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height * (5 * age) + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Sedentary = 1.2
  // Lightly active = 1.375
  // moderately active = 1.55
  // very active = 1.725
  // extra active = 1.9

  let activity_level_multiplier: number;

  switch (activity_level) {
    case "sedentary":
      activity_level_multiplier = 1.2;
      break;
    case "moderately_active":
      activity_level_multiplier = 1.375;
      break;
    case "lightly_active":
      activity_level_multiplier = 1.55;
      break;
    case "very_active":
      activity_level_multiplier = 1.725;
      break;
    case "extra_active":
      activity_level_multiplier = 1.9;
      break;

    default:
      throw new Error("failed to identify activity level");
  }

  return bmr * activity_level_multiplier;
}

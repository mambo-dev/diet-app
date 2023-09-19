import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(1, "please provide a username"),
    email: z
      .string()
      .min(1, "please provide an email")
      .email("provide a valid email"),
    password: z.string().min(1, "please provide a password"),
    confirmPassword: z
      .string()
      .min(1, "please provide a confirmation password"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  username: z.string().min(1, "please provide a username"),

  password: z.string().min(1, "please provide a password"),
});

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
  goals: z.array(z.string()),
});

export const add_meal_schema = z.object({
  food_items_ids: z.array(z.string().min(1, "please provide a food id ")),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snacks"]),
  meal_day_of_week: z.string().transform((week) => new Date(week)),
});

export const log_progress_schema = z.object({
  progress_date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a date!",
  }),
  progress_weight: z.number(),
  progress_waist: z.number(),
  progress_hips: z.number(),
  progress_energyLevel: z.enum(
    ["high", "moderate", "low"],

    {
      required_error: "Please select an energy level",
      invalid_type_error: "invalid option",
    }
  ),
  progress_mood: z.string().min(1, "enter your mood to log progress"),
  progress_exercise: z.string().min(1, "enter your mood to log progress"),
  progress_notes: z.string(),
});

export const log_adherence_schema = z.object({
  diet_adherence_date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a date!",
  }),
  diet_adherence_status: z.boolean(),

  diet_adherence_notes: z.string(),
});

export const addFoodSchema = z.object({
  id: z.string().min(1, "the food id should be provided"),
});
export const create_shopping_list = z.object({
  shopping_items: z
    .array(z.string().min(1, "please provide the food item"))
    .nonempty("you should have atleast one food item "),
});
export const edit_shopping_list = z.object({
  shopping_items: z
    .array(z.string().min(1, "please provide the food item"))
    .nonempty("you should have atleast one food item "),
  shopping_list_id: z.number(),
});

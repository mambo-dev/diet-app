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

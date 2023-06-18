import { NextRequest, NextResponse } from "next/server";
import verifyAuth from "../../../../lib/auth";
import { z } from "zod";
import { db } from "../../../../lib/prisma";
import * as argon2 from "argon2";

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

export async function POST(request: NextRequest): Promise<
  NextResponse<{
    success?: boolean;
    error?: string | z.ZodIssue[];
  }>
> {
  try {
    const { email, password, username } = signUpSchema.parse(request.body);

    const userExists = await db.user.findUnique({
      where: {
        user_username: username,
      },
    });

    if (userExists) {
      return NextResponse.json({
        error: "you already have an account try loggin in instead",
      });
    }

    const hash = await argon2.hash(password, {
      hashLength: 12,
    });

    await db.user.create({
      data: {
        user_username: username,
        user_password: hash,
        user_bio_data: {
          create: {
            biodata_email: email,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: error.issues,
      });
    }

    return NextResponse.json({
      error: "something went wrong with the server",
    });
  }
}

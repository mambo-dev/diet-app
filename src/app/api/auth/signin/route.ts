import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../lib/prisma";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

export const signInSchema = z.object({
  username: z.string().min(1, "please provide a username"),

  password: z.string().min(1, "please provide a password"),
});

export async function POST(request: Request): Promise<
  NextResponse<{
    success?: boolean;
    error?: string | z.ZodIssue[];
  }>
> {
  try {
    const body = await request.json();

    const { username, password } = signInSchema.parse(body);

    const userExists = await db.user.findUnique({
      where: {
        user_username: username,
      },
    });

    if (!userExists) {
      return NextResponse.json({
        error: "invalid password or username",
      });
    }

    const passwordMatches = await argon2.verify(
      userExists.user_password,
      password
    );

    if (!passwordMatches) {
      return NextResponse.json({
        error: "invalid password or username",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("jwt secret is not defined");
    }

    const access_token = jwt.sign(
      {
        id: userExists.user_id,
      },
      process.env.JWT_SECRET
    );

    let response = NextResponse.next();

    response.cookies.set("access_token", access_token, {
      path: "/",
      expires: 7.2e6,
      sameSite: "strict",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
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

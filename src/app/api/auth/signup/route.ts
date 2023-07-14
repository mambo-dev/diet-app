import { NextRequest, NextResponse } from "next/server";
import verifyAuth from "../../../../lib/auth";
import { z } from "zod";
import { db } from "../../../../lib/prisma";
import * as argon2 from "argon2";
import { signUpSchema } from "../../../../lib/schemas/schemas";
import { ServerResponse } from "../../../../lib/type";

export async function POST(
  request: Request
): Promise<NextResponse<ServerResponse<boolean>>> {
  try {
    const body = await request.json();

    const { email, password, username } = signUpSchema.parse(body);

    const userExists = await db.user.findUnique({
      where: {
        user_username: username,
      },
    });

    const emailInUse = await db.bioData.findUnique({
      where: {
        biodata_email: email,
      },
    });

    if (userExists || emailInUse) {
      return NextResponse.json({
        error: [
          {
            message: userExists
              ? "you already have an account try loggin in instead"
              : "this email is already in use try different email",
          },
        ],
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

    return NextResponse.json(
      {
        data: true,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 403,
        }
      );
    }

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

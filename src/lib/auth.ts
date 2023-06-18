import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { AuthorizedUser, DecodedToken } from "./type";
import jwt from "jsonwebtoken";

export default async function verifyAuth(
  authorizationString: string | undefined
): Promise<AuthorizedUser> {
  if (!authorizationString) {
    return {
      error: "No authorization provided",
    };
  }

  const token = authorizationString.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET as unknown as string;

  const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

  if (!decoded) {
    return {
      error: "Invalid token or user doesn't exist",
    };
  }

  return {
    username: "Michael",
  };
}

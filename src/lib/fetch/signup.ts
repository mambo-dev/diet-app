import { ServerResponse } from "../type";

interface ISignUp {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
}

export default async function sign_up(
  signUpDetails: ISignUp
): Promise<boolean | undefined> {
  const res = await fetch(`/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(signUpDetails),
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

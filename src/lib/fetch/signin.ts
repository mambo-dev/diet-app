import { ServerResponse } from "../type";

interface ISignIn {
  username: string;
  password: string;
}

export default async function sign_in(
  signUpDetails: ISignIn
): Promise<boolean | undefined> {
  const res = await fetch(`/api/auth/signin`, {
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

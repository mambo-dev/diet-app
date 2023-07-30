import { cookies } from "next/headers";
import { ServerResponse } from "../../type";

export default async function add_food_to_diet(
  nix_id: string,
  access_token: string
): Promise<boolean | undefined> {
  const res = await fetch(`/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token}`,
    },
    credentials: "include",
    body: JSON.stringify({ id: nix_id }),
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

import { ServerResponse } from "../../type";

export default async function delete_diet_plan(access_token: string) {
  const res = await fetch(`/api/diet-plan/delete`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token}`,
    },

    credentials: "include",
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    console.log(data.error);
    throw new Error("so wrong");
  }

  return data.data;
}

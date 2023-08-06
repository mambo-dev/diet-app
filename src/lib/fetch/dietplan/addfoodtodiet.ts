import { ServerResponse } from "../../type";

export default async function add_food_to_diet(
  nix_id: string,
  access_token: string
): Promise<boolean | undefined> {
  try {
    const body = {
      id: nix_id,
    };
    const res = await fetch(`/api/food/add-food-to-diet-plan`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Cookie: `access_token=${access_token}`,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = (await res.json()) as ServerResponse<boolean>;
    if (data.error && !data.data) {
      console.log(data.error);
      throw new Error("something went wrong");
    }
    return data.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

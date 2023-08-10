import { ServerResponse } from "../../type";

export default async function delete_shopping_list(
  access_token: string,
  shopping_list_id: number
) {
  const res = await fetch(
    `/api/shopping-list/delete?shopping_list_id=${shopping_list_id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Cookie: `access_token=${access_token}`,
      },

      credentials: "include",
    }
  );

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    console.log(data.error);
    throw new Error("something went wrong");
  }

  return data.data;
}

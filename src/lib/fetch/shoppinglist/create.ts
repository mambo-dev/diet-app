import { cookies } from "next/headers";
import { ServerResponse } from "../../type";


interface IShoppingList {
    shopping_items:string[]
}

export default async function create_shopping_list(
  shoppingList: IShoppingList,
  access_token: string
): Promise<boolean | undefined> {
  const res = await fetch(`/api/shopping-list/create`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token}`,
    },
    body: JSON.stringify(shoppingList),
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

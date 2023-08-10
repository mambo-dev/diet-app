import React from "react";
import { db } from "../../../lib/prisma";
import verifyAuth from "../../../lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Heading from "../../../components/ui/heading";
import EmptyState from "../../../components/ui/empty";
import { FolderPlus } from "lucide-react";
import DisplayShoppingLists from "../../../components/dashboard/shopping-lists/displayshoppinglists";
import { ShoppingList } from "@prisma/client";
import CreateShoppingList from "../../../components/dashboard/shopping-lists/createshoppinglist";

type Props = {};

async function get_shopping_lists(user_id: number): Promise<ShoppingList[]> {
  try {
    const shoppingLists = await db.shoppingList.findMany({
      where: {
        shopping_list_mealplan: {
          mealplan_user: {
            user_id,
          },
        },
      },
    });

    return shoppingLists;
  } catch (error) {
    throw new Error("failed to get lists");
  }
}

export default async function ShoppingListPage({}: Props) {
  const cookie = cookies();

  const access_token = cookie.get("access_token");

  const { user, error } = await verifyAuth(access_token?.value);
  if (!user) {
    redirect("/auth/signin");
  }

  const shopping_lists = await get_shopping_lists(user.user_id);

  return (
    <div className="flex py-10 w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between px-4 ">
        <Heading size="sm" className="text-slate-800">
          Shopping Lists
        </Heading>
        <div className="w-32">
          <CreateShoppingList />
        </div>
      </div>
      <div className="flex flex-col w-full py-2 px-4">
        {shopping_lists.length <= 0 ? (
          <EmptyState
            icon={<FolderPlus className=" w-14 h-14 " />}
            title="No shopping lists yet"
            subTitle="create shopping list"
          />
        ) : (
          <DisplayShoppingLists shoppingLists={shopping_lists} />
        )}
      </div>
    </div>
  );
}

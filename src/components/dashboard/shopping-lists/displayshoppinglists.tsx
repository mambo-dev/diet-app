"use client";
import { ShoppingList } from "@prisma/client";
import React from "react";
import EditShoppingList from "./editshoppinglist";

type Props = {
  shoppingLists: ShoppingList[];
};

export default function DisplayShoppingLists({ shoppingLists }: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-3 ">
      {shoppingLists
        .sort((a, b) => (a.shopping_list_id > b.shopping_list_id ? 1 : -1))
        .map((list) => {
          return (
            <div
              className="w-full py-2 px-1 border max-h-[300px]  border-slate-300 rounded-lg"
              key={list.shopping_list_id}
            >
              <div className="flex items-center justify-between w-full ">
                <span className="h-8 w-8 rounded-full shadow flex items-center justify-center font-semibold border border-slate-300">
                  {list.shopping_list_id}
                </span>
                <div className="w-fit flex items-center gap-2">
                  <EditShoppingList shoppingListId={list.shopping_list_id} />
                </div>
              </div>
              <ul className="list-disc text-sm  ">
                {list.shopping_list_ingridients.map((ingridient, index) => (
                  <li className="list-disc" key={index}>
                    {ingridient}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
    </div>
  );
}

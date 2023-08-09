"use client";

import React, { useState } from "react";
import Button from "../../ui/button";
import SidePanel from "../../ui/sidepanel";
import { Loader2, PlusCircle, X } from "lucide-react";
import { Input } from "../../ui/input";
import { toast } from "../../ui/toast";

type Props = {};

export default function CreateShoppingList({}: Props) {
  const [openNewShoppingList, setOpenNewShoppingList] = useState(false);
  return (
    <>
      <Button
        variant="default"
        size="sm"
        className=" inline-flex items-center justify-center gap-2"
        onClick={() => setOpenNewShoppingList(true)}
      >
        add new list
      </Button>
      <SidePanel
        title="create shopping list"
        setIsOpen={setOpenNewShoppingList}
        isOpen={openNewShoppingList}
      >
        <CreateShoppingListForm />
      </SidePanel>
    </>
  );
}

function CreateShoppingListForm() {
  const [listItem, setListItem] = useState("");
  const [listItems, setListItems] = useState<string[]>([]);
const [isLoading,setIsLoading] = useState(false)
  async function createNewShoppingList(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setIsLoading(true)
try {
    
} catch (error) {
    toast({
        title: "Server Error",
        message: "failed to create shopping list",
        type: "error",
      });
}finally{
    setIsLoading(false)
}
  } 
  return (
    <form onSubmit={createNewShoppingList} className="w-full flex flex-col gap-3">
      <div className="w-full flex items-center gap-2">
        <Input
          value={listItem}
          onChange={(e) => setListItem(e.target.value)}
          type="text"
        />
        <button
          type="button"
          onClick={() => setListItems([...listItems, listItem])}
          className=" group inline-flex items-center justify-center outline-none  h-fit rounded-full"
        >
          <PlusCircle className="h-5 w-5  text-slate-500 group-hover:text-slate-900  " />
        </button>
      </div>
      <div className="grid grid-cols-4 w-full gap-2">
        {listItems.map((listItem, index) => (
          <DisplayListItem
            key={index}
            item={listItem}
            setItems={setListItems}
          />
        ))}
      </div>
      <div className="w-32 ml-auto mt-10">
        {" "}
        <Button
          variant="default"
          size="sm"
          className=" inline-flex items-center justify-center gap-2"
          //@ts-ignore
          type="submit"
          isLoading={isLoading}
        >
          save
        </Button>
      </div>
    </form>
  );
}

export function DisplayListItem({
  item,
  setItems,
}: {
  item: string;
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="group flex items-center justify-between rounded-lg border border-slate-300 hover:bg-neutral-100 transition-all delay-75 hover:cursor-pointer py-2 px-3 ">
      {item}
      <button
        type="button"
        onClick={() => {
          setIsLoading(true);
          setItems((items) => {
            return items.filter((items) => items !== item);
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }}
        className="group inline-flex items-center justify-center outline-none w-fit h-fit rounded-full"
      >
        {isLoading ? (
          <Loader2 className=" h-6 w-6 animate-spin" />
        ) : (
          <X className="h-6 w-6  text-red-300 hover:text-red-500  " />
        )}
      </button>
    </div>
  );
}

import Cookies from "js-cookie";
import React, { useState } from "react";
import { toast } from "../../ui/toast";
import { useRouter } from "next/navigation";
import { Input } from "../../ui/input";
import { Pencil, PlusCircle } from "lucide-react";
import { DisplayListItem } from "./createshoppinglist";
import Button from "../../ui/button";
import SidePanel from "../../ui/sidepanel";
import edit_shopping_list from "../../../lib/fetch/shoppinglist/edit";

type Props = {
  shoppingListId: number;
};

export default function EditShoppingList({ shoppingListId }: Props) {
  const [openEditShoppingList, setOpenEditShoppingList] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenEditShoppingList(true)}
        className=" group inline-flex items-center justify-center outline-none  h-fit rounded-full"
      >
        <Pencil className="h-4 w-4  text-slate-600 group-hover:text-blue-500  " />
      </button>
      <SidePanel
        title="create shopping list"
        setIsOpen={setOpenEditShoppingList}
        isOpen={openEditShoppingList}
      >
        <EditShoppingListForm
          shoppingListId={shoppingListId}
          setIsOpen={setOpenEditShoppingList}
        />
      </SidePanel>
    </>
  );
}

function EditShoppingListForm({
  shoppingListId,
  setIsOpen,
}: {
  shoppingListId: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [listItem, setListItem] = useState("");
  const [listItems, setListItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function editShoppingList(
    e: React.FormEvent<HTMLFormElement>,
    shoppingListId: number
  ) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const access_token = Cookies.get("access_token") ?? "";
      await edit_shopping_list(
        {
          shopping_items: listItems,
          shopping_list_id: shoppingListId,
        },
        access_token
      );
      toast({
        title: "Great",
        message: "successfully edited shopping list",
        type: "success",
      });

      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Server Error",
        message: "failed to create shopping list",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form
      onSubmit={(e) => editShoppingList(e, shoppingListId)}
      className="w-full flex flex-col gap-3"
    >
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
        <Button
          variant="default"
          size="sm"
          className=" inline-flex items-center justify-center gap-2"
          //@ts-ignore
          type="submit"
          isLoading={isLoading}
        >
          update
        </Button>
      </div>
    </form>
  );
}

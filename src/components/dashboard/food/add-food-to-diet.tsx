"use client";
import { Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "../../ui/toast";
import add_food_to_diet from "../../../lib/fetch/dietplan/addfoodtodiet";
import Cookies from "js-cookie";

type Props = { food_nix_id: string };

export default function AddFoodToDiet({ food_nix_id }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);

  const addFood = async (selected_id: string) => {
    setIsLoading(true);
    try {
      const access_token = Cookies.get("access_token") ?? "";

      await add_food_to_diet(selected_id, access_token);

      toast({
        title: "Success",
        message: "We have added this food to you diet",
        type: "success",
      });
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);

      toast({
        title: "Server Error",
        message: "Oops sorry - You did everything right try again ",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedFood) {
      addFood(selectedFood);
    }
  }, [selectedFood]);
  return (
    <button
      type="button"
      onClick={() => {
        setSelectedFood(food_nix_id);
      }}
      className="inline-flex items-center justify-center outline-none hover:bg-green-200 h-fit rounded-full"
    >
      {isLoading ? (
        <Loader2 className=" h-6 w-6 animate-spin" />
      ) : (
        <Plus className="h-6 w-6" />
      )}
    </button>
  );
}

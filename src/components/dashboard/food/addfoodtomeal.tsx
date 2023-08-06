import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";

type Props = {
  setFoodsMealPlan?:
    | React.Dispatch<
        React.SetStateAction<
          {
            food_name: string;
            food_id: string;
          }[]
        >
      >
    | undefined;
  newFood: {
    food_name: string;
    food_id: string;
  };
};

export default function AddFoodToMeal({ setFoodsMealPlan, newFood }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setIsLoading(true);
        if (setFoodsMealPlan) {
          setFoodsMealPlan((foods) => [...foods, newFood]);
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
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

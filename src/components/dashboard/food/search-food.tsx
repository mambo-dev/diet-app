"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Loader2 } from "lucide-react";
import useDebounce from "../../hooks/debounce";
import Paragraph from "../../ui/paragraph";
import AddFoodToDiet from "./add-food-to-diet";

type Props = {};

export default function SearchFood({}: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);
  useEffect(() => {
    if (debouncedSearch) {
      setIsLoading(true);
      fetch(
        `https://trackapi.nutritionix.com/v2/search/instant?query=${searchInput}`,
        {
          headers: {
            "x-app-id": process.env.NEXT_PUBLIC_ID ?? "",
            "x-app-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
          },
        }
      )
        .then((response) => {
          if (response.status !== 200) {
            setErrors(true);
            return;
          }

          response.json().then((value) => {
            setFoods(value.branded);
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [debouncedSearch, searchInput]);
  //search foods

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="py-2 relative h-[400px] overflow-visible  "
    >
      <Input
        label="type in food name"
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {isLoading ? (
        <Loader2 className="mx-auto mt-2 text-slate-700 h-8 w-8 animate-spin" />
      ) : foods.length > 0 ? (
        <div className=" rounded-md mt-2 mb-2 w-full border border-gray-300">
          {foods.map((food: any) => {
            return (
              <Food
                key={food.nix_item_id}
                food_name={food.food_name}
                food_nix_id={food.nix_item_id}
              />
            );
          })}
        </div>
      ) : (
        errors && (
          <div className=" text-red-500 font-semibold text-xs py-2 px-2 overflow-auto   rounded-md  mt-2 w-full border border-gray-300">
            something went wrong!! try different food.
          </div>
        )
      )}
    </form>
  );
}

function Food({
  food_name,
  food_nix_id,
}: {
  food_name: string;
  food_nix_id: string;
}) {
  return (
    <div className=" py-2 text-slate-800 text-left px-2 w-full flex items-center justify-between hover:cursor-pointer hover:text-green-500 hover:bg-neutral-100   ">
      <Paragraph size="sm" className=" text-left font-medium  mr-auto text-sm ">
        {food_name}
      </Paragraph>
      <AddFoodToDiet food_nix_id={food_nix_id} />
    </div>
  );
}

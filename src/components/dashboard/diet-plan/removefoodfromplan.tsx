import { Loader2, X } from "lucide-react";
import React, { useState } from "react";
import remove_food_from_diet from "../../../lib/fetch/dietplan/removefoodfromdiet";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "../../ui/toast";

type Props = {
  food_id: number;
};

export default function RemoveFoodFromPlan({ food_id }: Props) {
  console.log(food_id);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function removeFoodFromPlan() {
    setIsLoading(true);
    try {
      const access_token = Cookies.get("access_token") ?? "";
      await remove_food_from_diet({ food_id, access_token });
      toast({
        title: "Success",
        message: "We have removed this food from your diet ",
        type: "success",
      });

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      toast({
        title: "Server Error",
        message: "Oops sorry - You did everything right try again ",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <button
      type="button"
      onClick={removeFoodFromPlan}
      className="group inline-flex items-center justify-center outline-none w-fit h-fit rounded-full"
    >
      {isLoading ? (
        <Loader2 className=" h-6 w-6 animate-spin" />
      ) : (
        <X className="h-6 w-6  text-red-300 hover:text-red-500  " />
      )}
    </button>
  );
}

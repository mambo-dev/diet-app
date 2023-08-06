"use client";
import React, { useState } from "react";
import Button from "../../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "../../ui/toast";
import generate_meal_plan from "../../../lib/fetch/mealplan/generatemealplan";
import { Plus } from "lucide-react";

type Props = {};

export default function GenerateMealPlan({}: Props) {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();

  async function generateMealPlan() {
    setIsloading(true);
    try {
      await generate_meal_plan();
      toast({
        message: "succesfully generated meal plan",
        type: "success",
        title: "Yeei!! Lets gooo",
      });

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      console.log(error);
      toast({
        message:
          "You did everything right but we could not submit your request ",
        duration: 3000,
        title: "Server Error",
        type: "error",
      });
    } finally {
      setIsloading(false);
    }
  }
  return (
    <Button
      variant="default"
      size="sm"
      className=" inline-flex items-center justify-center gap-2"
      isLoading={isLoading}
      onClick={generateMealPlan}
    >
      {!isLoading && <Plus className="text-xs" />}{" "}
      {isLoading ? "loading.." : "generate"}
    </Button>
  );
}

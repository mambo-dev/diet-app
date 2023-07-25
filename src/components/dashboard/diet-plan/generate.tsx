"use client";
import React, { useState } from "react";
import Button from "../../ui/button";
import { Plus } from "lucide-react";
import { toast } from "../../ui/toast";
import { HandleError } from "../../../lib/type";
import { useRouter } from "next/navigation";
import generate_diet_plan from "../../../lib/fetch/dietplan/dietplan";

type Props = {};

export default function GenerateDietPlan({}: Props) {
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();
  const generateDietPlan = async () => {
    setIsloading(true);
    try {
      const { data, error } = await generate_diet_plan();

      if (data) {
        toast({
          message: "succesfully generated diet plan",
          type: "success",
          title: "Yeei!! Lets gooo",
        });

        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        if (error instanceof Array) {
          error.forEach((error: HandleError) => {
            toast({
              //@ts-expect-error
              message: error.message.message ?? "",
              title: "Oops",
              type: "error",
              duration: 3000,
            });
          });
          return;
        } else {
          toast({
            //@ts-expect-error
            message: error?.message ? error.message.message : "",
            duration: 3000,
            title: "Server Error",
            type: "error",
          });
          return;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        JSON.parse(error.message).forEach((error: HandleError) => {
          toast({
            message: error.message ?? "",
            title: "Oops",
            type: "error",
            duration: 3000,
          });
        });

        return;
      }

      toast({
        message: "You did everything right could not submit your form tho",
        duration: 3000,
        title: "Server Error",
        type: "error",
      });
    } finally {
      setIsloading(false);
    }
  };
  return (
    <Button
      variant="default"
      size="sm"
      className=" inline-flex items-center justify-center gap-2"
      isLoading={isLoading}
      onClick={async () => {
        await generateDietPlan();
      }}
    >
      {!isLoading && <Plus className="text-xs" />}{" "}
      {isLoading ? "loading.." : "generate"}
    </Button>
  );
}

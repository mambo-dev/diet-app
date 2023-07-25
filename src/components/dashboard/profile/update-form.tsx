"use client";
import React, { useState } from "react";
import { HandleError } from "../../../lib/type";
import { useRouter } from "next/navigation";
import { bioDataSchema } from "../../../lib/schemas/schemas";
import { toast } from "../../ui/toast";
import { z } from "zod";
import update_bio_data from "../../../lib/fetch/profile";
import { BioData } from "@prisma/client";
import { Input } from "../../ui/input";
import Cookies from "js-cookie";
import SelectLifestyle from "../../ui/select";
import Paragraph from "../../ui/paragraph";
import Button from "../../ui/button";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bio_data: BioData;
};

export default function UpdateForm({ setIsOpen, bio_data }: Props) {
  const [selectedOption, setSelectedOption] = useState(
    `${bio_data.biodata_activity}`
  );

  const [initialState, setInitialState] = useState({
    age: bio_data.biodata_age,
    gender: bio_data.biodata_gender,
    weight: bio_data.biodata_weight,
    height: bio_data.biodata_height,
    goals: ["get lean"],
    activityLevel: selectedOption,
    desired_calorie_intake: bio_data.biodata_desired_calorie,
    carbohydrates_ratio: bio_data.biodata_carbohydrates_ratio,
    fats_ratio: bio_data.biodata_fats_ratio,
    proteins_ratio: bio_data.biodata_proteins_ratio,
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setInitialState({ ...initialState, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      //function to validate the form
      console.log(initialState);
      const {
        age,
        gender,
        weight,
        height,
        goals,
        activityLevel,
        desired_calorie_intake,
        carbohydrates_ratio,
        fats_ratio,
        proteins_ratio,
      } = bioDataSchema.parse(initialState);
      //function to create account
      const access_token = Cookies.get("access_token");
      await update_bio_data(
        {
          age: initialState.age,
          gender: initialState.gender,
          weight: initialState.weight,
          height: initialState.height,
          goals: initialState.goals,
          activityLevel,
          desired_calorie_intake: initialState.desired_calorie_intake,
          carbohydrates_ratio: initialState.carbohydrates_ratio,
          fats_ratio: initialState.fats_ratio,
          proteins_ratio: initialState.proteins_ratio,
        },
        access_token ?? ""
      );

      //redirect user to the dashboard
      toast({
        message: "Profile updated succesfully",
        title: "Yeeeeii!! Thank you, ",
        type: "success",
      });

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof z.ZodError) {
          error.issues
            .map((error) => {
              console.log("this errors", error);
              return {
                message: error.message,
              };
            })
            .forEach((error) => {
              toast({
                message: error.message,
                title: "required fields",
                type: "error",
                duration: 5000,
              });
            });
        } else {
          JSON.parse(error.message).forEach((error: HandleError) => {
            toast({
              message: error.message ?? "",
              title: "Oops",
              type: "error",
              duration: 3000,
            });
          });
        }

        return;
      }

      toast({
        message: "You did everything right could not submit your form tho",
        duration: 3000,
        title: "Server Error",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="py-3 flex flex-col items-start justify-center w-full gap-y-4"
    >
      <Paragraph size="sm" className="text-green-600 font-medium text-xs">
        we use this data to generate accurate diet plans
      </Paragraph>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
        <Input
          name="age"
          value={initialState.age}
          label="age"
          type="number"
          onChange={handleChange}
        />
        <Input
          name="weight"
          value={initialState.weight}
          label="weight"
          type="number"
          onChange={handleChange}
        />
        <Input
          name="height"
          value={initialState.height}
          label="height"
          type="number"
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
        <Input
          name="carbohydrates_ratio"
          value={initialState.carbohydrates_ratio}
          label="Carbohydrates"
          type="number"
          onChange={handleChange}
        />
        <Input
          name="proteins_ratio"
          value={initialState.proteins_ratio}
          label="Proteins"
          type="number"
          onChange={handleChange}
        />
        <Input
          name="fats_ratio"
          value={initialState.fats_ratio}
          label="Fats"
          type="number"
          onChange={handleChange}
        />
      </div>
      <div className="grid relative grid-cols-1 md:grid-cols-3 gap-2 w-full">
        <div className=" w-full h-fit">
          <SelectLifestyle
            options={[
              "sedentary",
              "lightly active",
              "moderately active",
              "very active",
              "extra active",
            ]}
            defaultOption={initialState.activityLevel}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>

        <div className="col-span-2 w-full">
          <Input
            name="desired_calorie_intake"
            value={initialState.desired_calorie_intake}
            label="Desired calorie intake"
            type="number"
            onChange={handleChange}
          />
        </div>
      </div>
      {/*save goals*/}
      <div className="w-32 ml-auto">
        <Button
          variant="default"
          size="lg"
          className="mt-2"
          isLoading={isLoading}
        >
          save
        </Button>
      </div>
    </form>
  );
}

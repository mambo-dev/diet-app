import { DietPlan, Food } from "@prisma/client";
import Image from "next/image";
import React from "react";
import Heading from "../../ui/heading";
import Paragraph from "../../ui/paragraph";

type Props = {
  diet_plan: DietPlan & {
    diet_plan_food: Food[];
  };
};

export default function DisplayDietPlan({ diet_plan }: Props) {
  return (
    <div className="w-full h-fit py-2 px-2  flex flex-col gap-3 items-center border border-slate-300 rounded-lg bg-white shadow">
      <div className=" flex items-end justify-center gap-x-2 w-fit mr-auto ">
        <div className="mr-auto relative w-20 h-20  ">
          <Image
            alt="diet display"
            src="/images/diet.png"
            className="w-full h-full object-cover"
            fill
            sizes=""
          />
        </div>
        <div className="w-fit mr-auto ">
          <Heading size="xs" className="text-sm text-slate-800 ">
            {diet_plan.dietplan_type === "Balanced"
              ? "balanced diet"
              : diet_plan.dietplan_type === "HighProtein"
              ? "High protein diet"
              : "Low carb diet"}
          </Heading>
          <Paragraph size="sm" className="text-slate-600">
            Your diet will contain{" "}
            <strong>{diet_plan.dietplan_mainMeals}</strong> main meals and{" "}
            <strong>{diet_plan.dietplan_snacks}</strong> snacks
          </Paragraph>
        </div>
      </div>
      <div className="w-full">
        <p className="text-slate-600 text-left w-full">
          {diet_plan.dietplan_description}
        </p>
      </div>
      <div className="w-full grid grid-cols-4">
        <DisplayStat
          label="calorie intake"
          value={Math.floor(diet_plan.dietplan_calorieIntake)}
        />
        <DisplayStat
          label="carbohydrates (g)"
          value={Math.floor(diet_plan.dietplan_carbohydratesPercentage)}
        />
        <DisplayStat
          label="proteins (g)"
          value={Math.floor(diet_plan.dietplan_proteinsPercentage)}
        />
        <DisplayStat
          label="fats (g)"
          value={Math.floor(diet_plan.dietplan_fatsPercentage)}
        />
      </div>
      <div className="w-full">
        {diet_plan.diet_plan_food.length > 0 ? (
          <div>
            {diet_plan.diet_plan_food.map((food) => {
              return <DietFood key={food.food_id} food={food.food_name} />;
            })}
          </div>
        ) : (
          <div className="mr-auto text-slate-600 ">
            you currently havent added any foods to your diet,{" "}
            <button className="outline-none text-green-500 font-bold hover:underline hover:text-green-600">
              add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DisplayStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-start gap-4">
      <Paragraph size="sm">
        {label}: <strong>{value}</strong>
      </Paragraph>
    </div>
  );
}

function DietFood({ food }: { food: string }) {
  return <span>{food}</span>;
}

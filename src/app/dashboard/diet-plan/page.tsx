"use server";
import React from "react";
import verifyAuth from "../../../lib/auth";
import Heading from "../../../components/ui/heading";
import GenerateDietPlan from "../../../components/dashboard/diet-plan/generate";
import EmptyState from "../../../components/ui/empty";
import { FolderPlus } from "lucide-react";
import get_diet_plan from "../../../lib/fetch/dietplan/get";
import DisplayDietPlan from "../../../components/dashboard/diet-plan/display-plan";

type Props = {};

export default async function DietPlanPage({}: Props) {
  const { data } = await get_diet_plan();
  return (
    <div className="flex py-10 w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between px-4 ">
        <Heading size="sm" className="text-slate-800">
          Diet plan
        </Heading>
        {!data && (
          <div className="w-32">
            <GenerateDietPlan />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full py-2 px-4">
        {!data ? (
          <EmptyState
            action={<GenerateDietPlan />}
            icon={<FolderPlus className="  h-14 " />}
            title="No diet plan"
            subTitle="start your journey by generating a plan"
          />
        ) : (
          <DisplayDietPlan diet_plan={data} />
        )}
      </div>
    </div>
  );
}

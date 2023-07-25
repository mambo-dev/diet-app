import React from "react";
import verifyAuth from "../../../lib/auth";
import Heading from "../../../components/ui/heading";
import GenerateDietPlan from "../../../components/dashboard/diet-plan/generate";

type Props = {};

export default function DietPlanPage({}: Props) {
  return (
    <div className="flex py-10 w-full">
      <div className="flex w-full items-center justify-between px-4">
        <Heading size="default">Diet plan</Heading>
        <div className="w-32">
          <GenerateDietPlan />
        </div>
      </div>
    </div>
  );
}

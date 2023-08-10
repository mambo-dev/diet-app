import React from "react";
import { FolderPlus } from "lucide-react";
import EmptyState from "../../../components/ui/empty";
import GenerateMealPlan from "../../../components/dashboard/meal-plan/generatemealplan";
import Heading from "../../../components/ui/heading";
import { cookies } from "next/headers";
import verifyAuth from "../../../lib/auth";
import { redirect } from "next/navigation";
import { db } from "../../../lib/prisma";
import { Progress } from "@prisma/client";
import LogProgress from "../../../components/dashboard/statistics/logprogress";
import LogAdherence from "../../../components/dashboard/statistics/logadherence";

type Props = {};

async function get_user_progress(user_id: number): Promise<Progress[]> {
  try {
    const progress = await db.progress.findMany({
      where: {
        progress_user: {
          user_id,
        },
      },
    });

    return progress;
  } catch (error) {
    throw new Error("could not get user progress");
  }
}

export default async function MealPlanPage({}: Props) {
  const cookie = cookies();

  const access_token = cookie.get("access_token");

  const { user, error } = await verifyAuth(access_token?.value);

  if (!user) {
    redirect("/auth/signin");
  }

  const progress = await get_user_progress(user.user_id);

  return (
    <div className="flex py-10 w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between px-4 ">
        <Heading size="sm" className="text-slate-800">
          Progress
        </Heading>
        <div className="w-fit flex gap-3 items-center">
          <LogProgress />
        </div>
      </div>
      <div className="flex flex-col w-full py-2 px-4">
        {progress.length < 0 ? (
          <EmptyState
            action={<GenerateMealPlan />}
            icon={<FolderPlus className=" w-14 h-14 " />}
            title="No progress logged yet"
            subTitle="Start tracking your progress "
          />
        ) : (
          <div>progress</div>
        )}
      </div>
    </div>
  );
}

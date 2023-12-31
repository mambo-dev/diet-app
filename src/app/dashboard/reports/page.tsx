import React from "react";
import { FolderPlus } from "lucide-react";
import EmptyState from "../../../components/ui/empty";
import GenerateMealPlan from "../../../components/dashboard/meal-plan/generatemealplan";
import Heading from "../../../components/ui/heading";
import { cookies } from "next/headers";
import verifyAuth from "../../../lib/auth";
import { redirect } from "next/navigation";
import { db } from "../../../lib/prisma";
import { DietAdherence, Progress } from "@prisma/client";

import LogAdherence from "../../../components/dashboard/statistics/adherence/logadherence";
import Reports from "../../../components/dashboard/statistics/reports";

export const metadata = {
  title: "Healthy Haven | Reports",
  description: "Let's help you achieve your health goals",
};

async function get_user_progress(user_id: number): Promise<{
  progress: Progress[];
  adherence: DietAdherence[];
}> {
  try {
    const progress = await db.progress.findMany({
      take: 10,
      where: {
        progress_user: {
          user_id,
        },
      },
      orderBy: {
        progress_date: "desc",
      },
    });

    const adherence = await db.dietAdherence.findMany({
      take: 10,
      where: {
        diet_adherence_user: {
          user_id,
        },
      },
      orderBy: {
        diet_adherence_date: "desc",
      },
    });

    return {
      progress,
      adherence,
    };
  } catch (error) {
    throw new Error("could not get user progress");
  }
}

export default async function ReportsPage({ params, searchParams }: any) {
  const cookie = cookies();

  const tab = searchParams.tab
    ? (searchParams.tab as "progress" | "adherence")
    : "progress";
  const access_token = cookie.get("access_token");

  const { user, error } = await verifyAuth(access_token?.value);

  if (!user) {
    redirect("/auth/signin");
  }

  const { progress, adherence } = await get_user_progress(user.user_id);

  return (
    <div className="flex py-10 w-full flex-col gap-2">
      <Reports
        adherence={adherence}
        progress={progress}
        user={user}
        tab={tab}
      />
    </div>
  );
}

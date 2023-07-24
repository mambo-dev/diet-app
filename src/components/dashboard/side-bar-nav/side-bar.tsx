import React from "react";
import { HandleError, ServerResponse } from "../../../lib/type";
import { BioData } from "@prisma/client";
import { toast } from "../../ui/toast";
import { cookies } from "next/headers";
import Heading from "../../ui/heading";
import Paragraph from "../../ui/paragraph";
import Button from "../../ui/button";

type Props = {};

async function fetch_bio_data() {
  const cookie = cookies();

  const access_token = cookie.get("access_token");
  try {
    const res = await fetch(`http://localhost:3000/api/user`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Cookie: `access_token=${access_token?.value}`,
      },
      credentials: "include",
    });

    const data = (await res.json()) as ServerResponse<{
      data?: BioData;
      error?: HandleError | HandleError[] | null;
    }>;

    if (data.error || !data.data) {
      return {
        error: "failed to get bio data",
      };
    }

    return {
      bio_data: data.data,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "failed to get bio data",
    };
  }
}

export default async function SideBar({}: Props) {
  const { bio_data, error } = await fetch_bio_data();
  console.log(bio_data);
  return (
    <div className="w-[300px] h-full">
      <div className="h-[250px] bg-gray-900 flex text-slate-100 flex-col items-start justify-center px-3">
        <Heading size="xs" className="text-slate-50 text-sm flex">
          Healthy<p className="text-green-500">Haven</p>
        </Heading>
        <Paragraph size="sm" className="text-slate-300">
          Healthy foods, healthy life.
        </Paragraph>

        <div className="flex items-center w-full pt-3">
          <Button variant="default" size="lg">
            {bio_data && bio_data.data && bio_data?.data.biodata_weight === 0
              ? "Create profile"
              : "View profile"}
          </Button>
        </div>
      </div>
      <div className="bg-slate-50 h-screen">nav</div>
    </div>
  );
}

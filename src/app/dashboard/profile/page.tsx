import React from "react";
import Heading from "../../../components/ui/heading";
import Image from "next/image";
import { cookies } from "next/headers";
import verifyAuth from "../../../lib/auth";
import { db } from "../../../lib/prisma";
import { toast } from "../../../components/ui/toast";
import Paragraph from "../../../components/ui/paragraph";
import UpdateProfile from "../../../components/dashboard/profile/update-button";

type Props = {};

async function get_user_bio() {
  const cookie = cookies();

  const access_token = cookie.get("access_token");

  const { user, error } = await verifyAuth(access_token?.value);

  if (!user || error) {
    return {
      error: {
        message: error,
      },
    };
  }

  const find_user_bio = await db.bioData.findUnique({
    where: {
      biodata_user_id: user?.user_id,
    },
    include: {
      biodata_user: {
        select: {
          user_username: true,
          user_password: false,
        },
      },
    },
  });

  if (!find_user_bio) {
    return {
      error: {
        message: "could not find any bio ",
      },
    };
  }

  return {
    bio_data: find_user_bio,
  };
}

export default async function ProfilePage({}: Props) {
  const { bio_data, error } = await get_user_bio();

  if (error && error.message) {
    toast({
      message: error.message,
      duration: 3000,
      title: "error",
    });
    return;
  }

  return (
    <div className="flex py-10 px-4  w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between ">
        <Heading size="sm" className="text-slate-800">
          Profile
        </Heading>
        <div className="w-32">
          <UpdateProfile />
        </div>
      </div>
      <div className="w-full relative rounded-md h-[250px]">
        <Image
          alt="a profile banner"
          src="/images/profile-banner.jpg"
          fill
          sizes=""
          className="rounded-md object-cover"
        />
      </div>
      <div className="w-full flex flex-col gap-2 relative rounded-md bg-white shadow-sm  border border-gray-300  py-2 px-2">
        <div className="grid grid-cols-3 gap-2 w-full">
          <BioDataInfo
            title="Username"
            value={bio_data?.biodata_user.user_username}
          />
          <BioDataInfo title="Email" value={bio_data?.biodata_email} />
          <BioDataInfo title="Gender" value={bio_data?.biodata_gender} />
        </div>
        <Heading size="xs" className="text-slate-700 text-sm">
          Dietary details
        </Heading>
        <div className="grid grid-cols-3 gap-2 w-full">
          <BioDataInfo title="Weight" value={bio_data?.biodata_weight} />
          <BioDataInfo title="Height" value={bio_data?.biodata_height} />
          <BioDataInfo title="Activity" value={bio_data?.biodata_activity} />
          <BioDataInfo title="Age" value={bio_data?.biodata_age} />
          <BioDataInfo
            title="Desired calorie intake"
            value={bio_data?.biodata_desired_calorie}
          />
          <BioDataInfo
            title="Carbohydrates ratio"
            value={bio_data?.biodata_carbohydrates_ratio}
          />
          <BioDataInfo
            title="Proteins ratio"
            value={bio_data?.biodata_proteins_ratio}
          />
          <BioDataInfo
            title="Fats ratio"
            value={bio_data?.biodata_fats_ratio}
          />
        </div>
      </div>
    </div>
  );
}

type InfoProps = {
  title: string;
  value: any;
};

function BioDataInfo({ title, value }: InfoProps) {
  return (
    <div className="W-full h-full flex flex-col items-start justify-center ">
      <Paragraph size="sm" className="text-slate-800 font-semibold">
        {title}
      </Paragraph>

      <Paragraph size="sm" className="text-slate-700 text-sm">
        {value}
      </Paragraph>
    </div>
  );
}

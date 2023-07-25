import React from "react";
import { HandleError, ServerResponse } from "../../../lib/type";
import { BioData } from "@prisma/client";
import { toast } from "../../ui/toast";
import { cookies } from "next/headers";
import Heading from "../../ui/heading";
import Paragraph from "../../ui/paragraph";
import Button, { buttonVariants } from "../../ui/button";
import Link from "next/link";
import {
  FilePieChart,
  LayoutDashboard,
  Salad,
  ShoppingCart,
  User,
  UtensilsCrossed,
} from "lucide-react";

type Props = {};

async function fetch_bio_data(): Promise<{
  error?: string;
  bio_data?: BioData;
}> {
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

    const data = (await res.json()) as {
      data?: BioData;
      error?: HandleError | HandleError[] | null;
    };

    console.log("this is the data we get", data.data);

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

const NavLinks = [
  {
    link: "/dashboard",
    name: "home",
    icon: <LayoutDashboard />,
  },
  {
    link: "/dashboard/diet-plan",
    name: "Diet plan",
    icon: <Salad />,
  },
  {
    link: "/dashboard/meal-plan",
    name: "Meal plan",
    icon: <UtensilsCrossed />,
  },
  {
    link: "/dashboard/shopping-list",
    name: "Shopping list",
    icon: <ShoppingCart />,
  },
  {
    link: "/dashboard/reports",
    name: "reports",
    icon: <FilePieChart />,
  },
];

export default async function SideBar({}: Props) {
  const { bio_data, error } = await fetch_bio_data();

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
          <Link
            href="/dashboard/profile"
            className={buttonVariants({
              variant: "link",
              size: "lg",
              className: "inline-flex items-center justify-center gap-4",
            })}
          >
            <User className="text-sm" />
            {/**@TODO fix type error */}
            {/**@ts-ignore */}
            {bio_data && bio_data && bio_data?.biodata_weight === 0
              ? "Create profile"
              : "View profile"}
          </Link>
        </div>
      </div>
      <div className="bg-slate-50 h-full">
        <ul className="w-full flex items-center justify-center flex-col">
          {NavLinks.map((link) => {
            return (
              <Link
                href={link.link}
                key={link.name}
                className="py-4 hover:bg-white flex px-5 w-full "
              >
                <li className=" flex items-center justify-start gap-4 text-green-500 text-sm font-medium">
                  {link.icon}
                  {link.name}
                </li>
              </Link>
            );
          })}
        </ul>
        <div className="mb-0">.</div>
      </div>
    </div>
  );
}

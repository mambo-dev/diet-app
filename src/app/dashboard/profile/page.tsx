import React from "react";
import Heading from "../../../components/ui/heading";

type Props = {};

export default function ProfilePage({}: Props) {
  return (
    <div className="flex py-10 w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between px-4 ">
        <Heading size="sm" className="text-slate-800">
          Profile
        </Heading>
      </div>
    </div>
  );
}

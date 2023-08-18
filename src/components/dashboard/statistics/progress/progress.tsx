"use client";
import { Progress } from "@prisma/client";
import React from "react";

type Props = {
  progress: Progress[];
};

export default function Progress({ progress }: Props) {
  return <div>Progress</div>;
}

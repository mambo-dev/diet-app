"use client";
import React, { useState } from "react";
import Button from "../../ui/button";
import UpdateForm from "./update-form";
import SidePanel from "../../ui/sidepanel";
import { BioData } from "@prisma/client";

type Props = {
  bio_data: BioData;
};

export default function UpdateProfile({ bio_data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        size="sm"
        className=" inline-flex items-center justify-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        update
      </Button>
      <SidePanel isOpen={isOpen} setIsOpen={setIsOpen} title="Update Profile">
        <UpdateForm setIsOpen={setIsOpen} bio_data={bio_data} />
      </SidePanel>
    </>
  );
}

"use client";
import React, { useState } from "react";
import Button from "../../ui/button";
import UpdateForm from "./update-form";
import SidePanel from "../../ui/sidepanel";

type Props = {};

export default function UpdateProfile({}: Props) {
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
        <UpdateForm setIsOpen={setIsOpen} />
      </SidePanel>
    </>
  );
}

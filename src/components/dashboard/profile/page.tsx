"use client";
import React, { useState } from "react";
import Button from "../../ui/button";

type Props = {};

export default function UpdateProfile({}: Props) {
  const [open, setIsOpen] = useState(false);

  return (
    <Button
      variant="default"
      size="sm"
      className=" inline-flex items-center justify-center gap-2"
      onClick={() => setIsOpen(true)}
    >
      update
    </Button>
  );
}

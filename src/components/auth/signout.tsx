"use client";
import React from "react";
import Button from "../ui/button";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type Props = {};

export default function SignOutButton({}: Props) {
  const router = useRouter();
  const signOut = async () => {
    try {
      await fetch(`http://localhost:3000/api/auth/signout`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      toast({
        type: "success",
        title: "Good Bye 👋",
        message: "can't wait to see you again. ",
        duration: 2000,
      });

      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      toast({
        type: "error",
        title: "Ooops!",
        message: "failed to log you out try again",
        duration: 3000,
      });
    }
  };
  return (
    <button
      onClick={signOut}
      className="text-sm inline-flex items-center justify-start text-green-500 hover:text-red-500 font-mediumfont-medium gap-3 py-4 hover:bg-white  px-5 w-full "
    >
      <LogOut className="text-sm" /> Sign out
    </button>
  );
}

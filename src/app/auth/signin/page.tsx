"use client";
import Image from "next/image";
import React, { useState } from "react";
import Heading from "../../../components/ui/heading";
import Paragraph from "../../../components/ui/paragraph";
import { Input } from "../../../components/ui/input";
import Button from "../../../components/ui/button";
import { toast } from "../../../components/ui/toast";
import { z } from "zod";
import sign_in from "../../../lib/fetch/signin";
import { useRouter } from "next/navigation";
import { signInSchema } from "../../../lib/schemas/schemas";
import { HandleError } from "../../../lib/type";

type Props = {};

export default function SignInPage(props: Props) {
  const [initialState, setInitialState] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setInitialState({ ...initialState, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      //function to validate the form
      const { username, password } = signInSchema.parse(initialState);
      //function to create account

      await sign_in({
        username,
        password,
      });
      //redirect user to the dashboard
      toast({
        message: "Continue your dieting journey",
        title: "Welcome back, ",
        type: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof z.ZodError) {
          error.issues
            .map((error) => {
              return {
                message: error.message,
              };
            })
            .forEach((error) => {
              toast({
                message: error.message,
                title: "required fields",
                type: "error",
                duration: 5000,
              });
            });
        } else {
          JSON.parse(error.message).forEach((error: HandleError) => {
            toast({
              message: error.message ?? "",
              title: "Oops",
              type: "error",
              duration: 3000,
            });
          });
        }

        return;
      }

      toast({
        message: "You did everything right could not submit your form tho",
        duration: 3000,
        title: "Server Error",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen h-full flex ">
      <div className="w-full md:w-[40%] mx-auto flex flex-col items-center gap-3  py-28  px-4 md:px-10">
        <div className="flex flex-col items-center   mr-auto">
          <Heading className="mr-auto " size="xs">
            Welcome back,
          </Heading>
          <Paragraph className="mr-auto" size="sm">
            Glad to see you again
          </Paragraph>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-full gap-y-3"
        >
          <Input
            name="username"
            value={initialState.username}
            label="username"
            type="text"
            onChange={handleChange}
          />
          <Input
            name="password"
            value={initialState.password}
            label="password"
            type="password"
            onChange={handleChange}
          />

          <Button
            variant="default"
            size="lg"
            className="mt-2"
            isLoading={isLoading}
          >
            sign in
          </Button>
        </form>
      </div>
      <div className="hidden md:flex relative h-screen w-[40%]">
        <Image alt="sign up banner" src="/images/signup.jpg" fill />
      </div>
    </div>
  );
}

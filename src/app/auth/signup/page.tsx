"use client";
import Image from "next/image";
import React, { useState } from "react";
import Heading from "../../../components/ui/heading";
import Paragraph from "../../../components/ui/paragraph";
import { Input } from "../../../components/ui/input";
import Button from "../../../components/ui/button";
import { toast } from "../../../components/ui/toast";
import { signUpSchema } from "../../../lib/schemas/schemas";

type Props = {};

const SignUpPage = (props: Props) => {
  const [initialState, setInitialState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setInitialState({ ...initialState, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      //function to validate the form
      const { username, email, password, confirmPassword } =
        signUpSchema.parse(initialState);
      //function to create account

      //function to login
      //redirect user to the dashboard

      toast({
        message: "Glad to have you as a team member",
        title: "Welcome to healthy haven",
        type: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          message: error.message,
          title: "Error",
          type: "error",
        });
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
      <div className="w-[40%] mx-auto flex flex-col items-center gap-3  py-20 px-10">
        <div className="flex flex-col items-center   mr-auto">
          <Heading className="mr-auto " size="xs">
            Welcome to Healthy haven
          </Heading>
          <Paragraph className="mr-auto" size="sm">
            Achieve your goals with us today
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
            name="email"
            value={initialState.email}
            label="email"
            type="email"
            onChange={handleChange}
          />
          <Input
            name="password"
            value={initialState.password}
            label="password"
            type="password"
            onChange={handleChange}
          />
          <Input
            name="username"
            value={initialState.confirmPassword}
            label="confirm password"
            type="password"
            onChange={handleChange}
          />
          <Button
            variant="default"
            size="lg"
            className="mt-2"
            isLoading={isLoading}
          >
            sign up
          </Button>
        </form>
      </div>
      <div className=" relative h-screen w-[40%]">
        <Image alt="sign up banner" src="/images/signup.jpg" fill />
      </div>
    </div>
  );
};

export default SignUpPage;

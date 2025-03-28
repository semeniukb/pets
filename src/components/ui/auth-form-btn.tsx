"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type AuthFormBtnProps = {
  actionType: "logIn" | "signUp";
};

export const AuthFormBtn = ({ actionType }: AuthFormBtnProps) => {
  const { pending } = useFormStatus();

  return (<Button disabled={pending}>{actionType === "logIn" ? "Log in" : "Sign up"}</Button>
  );
};
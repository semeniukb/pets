"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useState } from "react";
import { flushSync } from "react-dom";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function PetButton({
  actionType,
  disabled,
  onClick,
  children,
}: PetButtonProps) {
  if (actionType === "add") {
    return (
      <Button size="icon" onClick={onClick}>
        <PlusIcon className="h-6 w-6" />
      </Button>
    );
  }

  if (actionType === "edit") {
    return (
      <Button variant="secondary" disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    );
  }

  if (actionType === "checkout") {
    return (
      <Button variant="secondary" disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    );
  }
}

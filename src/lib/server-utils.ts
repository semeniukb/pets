import "server-only";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Pet, User } from "@prisma/client";
import prisma from "@/lib/db";

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function getPetById(petId: Pet["id"]) {
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
  });

  return pet;
}

export async function getPetsByUserId(userId: User["id"]) {
  const pets = await prisma.pet.findMany({
    where: {
      userId,
    },
  });

  return pets;
}


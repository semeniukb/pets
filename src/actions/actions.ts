"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/server-utils";

// --Auth actions--
export async function logIn(fromDate: FormData) {
  await signIn("credentials", fromDate);

  redirect("app/dashboard");
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(fromDate: FormData) {
  const hashedPassword = await bcrypt.hash(fromDate.get("password") as string, 10);

  await prisma.user.create({
    data: {
      email: fromDate.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", fromDate);
}

// --Pets actions--
export async function addPet(petData: unknown) {
  await sleep(2000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(petData);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("app", "layout");
}

export async function editPet(petId: unknown, petData: unknown) {
  await sleep(2000);

  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(petData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
  });
  if (!pet) {
    return "Pet not found.";
  }
  if (pet.userId !== session.user.id) {
    return "Not authorized";
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not update pet.",
    };
  }

  revalidatePath("app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(2000);

  const session = await checkAuth();


  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet id.",
    };
  }

  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
  });
  if (!pet) {
    return "Pet not found.";
  }
  if (pet.userId !== session.user.id) {
    return "Not authorized";
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not update pet.",
    };
  }

  revalidatePath("app", "layout");
}

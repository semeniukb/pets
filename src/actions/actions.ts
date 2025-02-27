"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";
import {PetEssential} from "@/lib/types";
import {Pet} from "@prisma/client";

export async function addPet(petData: unknown) {
  await sleep(2000);
  try {
    await prisma.pet.create({
      data: petData,
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("app", "layout");
}

export async function editPet(petId: Pet["id"], petData: unknown) {
  await sleep(2000);
  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: petData.get("name"),
        ownerName: petData.get("ownerName"),
        age: parseInt(petData.get("age")),
        imageUrl:
            petData.get("imageUrl") ||
          "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
        notes: petData.get("notes"),
      },
    });
  } catch (error) {
    return {
      message: "Could not update pet.",
    };
  }

  revalidatePath("app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  await sleep(2000);
  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "Could not update pet.",
    };
  }

  revalidatePath("app", "layout");
}

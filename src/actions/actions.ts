"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";

export async function addPet(petData) {
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

export async function editPet(petId, petData) {
  await sleep(2000);
  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: formData.get("name"),
        ownerName: formData.get("ownerName"),
        age: parseInt(formData.get("age")),
        imageUrl:
          formData.get("imageUrl") ||
          "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
        notes: formData.get("notes"),
      },
    });
  } catch (error) {
    return {
      message: "Could not update pet.",
    };
  }

  revalidatePath("app", "layout");
}

export async function deletePet(petId: string) {
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

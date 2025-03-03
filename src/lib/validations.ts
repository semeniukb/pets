import { z } from "zod";
import { DEFAULT_IMAGE_URL } from "./constants";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }).max(100),
  ownerName: z.string().trim().min(1, { message: "Owner name is required." }).max(100),
  age: z.coerce.number().int().min(1, { message: "Age is required." }).max(100),
  imageUrl: z.union([z.string().trim().url({ message: "Image URL must be a valid URL." }), z.literal("")]),
  notes: z.union([z.string().trim().max(1000), z.literal("")]),
}).transform(data => ({
  ...data,
  imageUrl: data.imageUrl || DEFAULT_IMAGE_URL,
}));

export type TPetForm = z.infer<typeof petFormSchema>;

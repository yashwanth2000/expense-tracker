import { DeleteCategory } from "@/app/manage/_actions/delete-category";
import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().min(1).max(20),
  type: z.enum(["income", "expense"]),
});

export const DeleteCategorySchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(["income", "expense"]),
});

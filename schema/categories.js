import { z } from "zod";

export const CreateCategorySchema = z.object({
    name:z.string().min(3).max(20),
    icon:z.string().min(1).max(20),
    type: z.enum(["income", "expense"]),
});

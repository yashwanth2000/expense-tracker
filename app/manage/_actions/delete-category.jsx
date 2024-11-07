"use server";

import { DeleteCategorySchema } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Category } from "@/models/CategoryModel";
import connectDB from "@/lib/mongodb";

export async function DeleteCategory(form) {
  await connectDB();

  try {
    const parsedBody = DeleteCategorySchema.safeParse(form);
    if (!parsedBody.success) {
      throw new Error("Invalid request data");
    }

    const user = await currentUser();
    if (!user) {
      return redirect("/sign-in");
    }

    const result = await Category.deleteOne({
      userId: user.id,
      name: parsedBody.data.name,
      type: parsedBody.data.type,
    });

    if (result.deletedCount === 0) {
      throw new Error("Category not found or already deleted");
    }

    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    throw new Error(error.message || "Failed to delete category");
  }
}

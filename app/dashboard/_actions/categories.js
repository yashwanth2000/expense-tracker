"use server";

import { CreateCategorySchema } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Category } from "@/models/CategoryModel";

export async function CreateCategory(form) {
  try {
    const parsedBody = CreateCategorySchema.safeParse(form);

    if (!parsedBody.success) {
      throw new Error("Bad Request");
    }

    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const { name, icon, type } = parsedBody.data;

    const category = await Category.create({
      userId: user.id,
      name,
      icon,
      type,
    });

    // Convert the Mongoose document to a plain JavaScript object
    const plainCategory = category.toJSON();

    // Return the plain object
    return {
      id: plainCategory._id.toString(),
      name: plainCategory.name,
      icon: plainCategory.icon,
      type: plainCategory.type,
      userId: plainCategory.userId,
      createdAt: plainCategory.createdAt,
    };
  } catch (error) {
    // Better error handling
    if (error.code === 11000) {
      throw new Error("Category already exists");
    }
    throw new Error(error.message || "Failed to create category");
  }
}

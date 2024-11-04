import { Category } from "@/models/CategoryModel";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { z } from "zod";

export async function GET(request) {
  await connectDB();

  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in"); // Use return to prevent further execution
  }

  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  // Define validator without .nullable()
  const validator = z.enum(["income", "expense"]);
  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return new Response(JSON.stringify(queryParams.error), { status: 400 });
  }

  const type = queryParams.data;
  const categories = await Category.find({
    userId: user.id,
    ...(type && { type }), // Conditionally add 'type' if defined
  }).sort({ name: "asc" }); // Use sort for MongoDB sorting

  return new Response(JSON.stringify(categories));
}

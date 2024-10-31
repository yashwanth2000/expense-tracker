import connectDB from "@/lib/mongodb";
import { UserSettings } from "@/models/UserSettings";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request) {
  await connectDB();

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Use let to allow reassignment if `userSettings` doesn't exist
  let userSettings = await UserSettings.findOne({
    userId: user.id,
  });

  if (!userSettings) {
    userSettings = await UserSettings.create({
      userId: user.id,
      currency: "INR",
    });
  }

  // Revalidate the dashboard page that uses the user currency
  revalidatePath("/dashboard");

  return new Response(JSON.stringify(userSettings), {
    headers: { "Content-Type": "application/json" },
  });
}

import { MonthHistory } from "@/models/MonthHistoryModel";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";

export async function GET(request) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const period = await getHistoryPeriods(user.id);
  return new Response(JSON.stringify(period));
}

async function getHistoryPeriods(userId) {
  try {
    const result = await MonthHistory.aggregate([
      { $match: { userId } },
      { $group: { _id: "$year" } },
      { $sort: { _id: 1 } },
    ]);

    const years = result.map((el) => el._id);

    if (years.length === 0) {
      return [new Date().getFullYear()];
    }
    return years;
  } catch (error) {
    console.error("Error fetching history periods:", error);
    throw error;
  }
}

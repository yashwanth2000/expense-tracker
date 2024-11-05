import { Transaction } from "@/models/TransactionModel";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";

export async function GET(request) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
    return;
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  // Fetch transaction statistics based on user ID and date range
  const state = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return new Response(JSON.stringify(state));
}

// Aggregation function to calculate category-based stats for transactions
async function getCategoriesStats(userId, from, to) {
  const stats = await Transaction.aggregate([
    {
      // Match transactions based on user ID and date range
      $match: {
        userId: userId,
        date: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      },
    },
    {
      // Group transactions by type, category, and category icon, and calculate the sum of amounts
      $group: {
        _id: {
          type: "$type",
          category: "$category",
          categoryIcon: "$categoryIcon",
        },
        totalAmount: { $sum: "$amount" }, // Sum of `amount` field for each group
      },
    },
    {
      // Sort results by `totalAmount` in descending order
      $sort: { totalAmount: -1 },
    },
  ]);

  return stats;
}

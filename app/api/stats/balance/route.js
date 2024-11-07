import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Transaction } from "@/models/TransactionModel";

export async function GET(request) {
  await connectDB(); 
  const user = await currentUser(); 

  if (!user) {
    redirect("/sign-in"); 
  }

  const { searchParams } = new URL(request.url); 
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return new Response(JSON.stringify(queryParams.error), { status: 400 }); 
  }

  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  ); // Fetch balance statistics based on user ID and date range

  return new Response(JSON.stringify(stats));
}

// Helper function to calculate total income and expenses within the specified date range
async function getBalanceStats(userId, from, to) {
  const totals = await Transaction.aggregate([
    {
      $match: {
        userId: userId,
        date: {
          $gte: new Date(from), // Match transactions on or after the start date
          $lte: new Date(to), // Match transactions on or before the end date
        },
      },
    },
    {
      $group: {
        _id: "$type", // Group transactions by type ("income" or "expense")
        totalAmount: { $sum: "$amount" }, // Calculate the sum of amounts for each type
      },
    },
  ]);

  return {
    expense: totals.find((t) => t._id === "expense")?.totalAmount || 0,
    income: totals.find((t) => t._id === "income")?.totalAmount || 0, 
  };
}

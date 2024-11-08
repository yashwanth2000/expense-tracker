import connectDB from "@/lib/mongodb";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";
import { MonthHistory } from "@/models/MonthHistoryModel";
import { YearHistory } from "@/models/YearHistoryModel";

// Validation Schema
const getHistoryDataSchema = z.object({
  timeFrame: z.enum(["year", "month"]),
  month: z.coerce.number().min(1).max(12).default(1),
  year: z.coerce.number().min(2000).max(3000),
});

// Route Handler
export async function GET(request) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  //   console.log("Incoming parameters:", { timeFrame, year, month });

  const queryParams = getHistoryDataSchema.safeParse({
    timeFrame,
    month,
    year,
  });

  if (!queryParams.success) {
    // console.error("Validation failed:", queryParams.error.message);
    return new Response(JSON.stringify(queryParams.error.message), {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeFrame, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return new Response(JSON.stringify(data));
}

// Aggregation Functions
async function getHistoryData(userId, timeFrame, period) {
  switch (timeFrame) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
    default:
      return new Response(JSON.stringify("Invalid time frame"), {
        status: 400,
      });
  }
}

async function getYearHistoryData(userId, year) {
  const result = await YearHistory.aggregate([
    { $match: { userId, year } },
    {
      $group: {
        _id: "$month",
        expense: { $sum: "$expense" },
        income: { $sum: "$income" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Create an array with all months
  const completeYearData = [];
  for (let month = 1; month <= 12; month++) {
    const monthData = result.find((item) => item._id === month) || {
      _id: month,
      expense: 0,
      income: 0,
    };

    completeYearData.push({
      _id: month,
      year,
      month: month - 1,
      expense: monthData.expense || 0,
      income: monthData.income || 0,
    });
  }

  return completeYearData;
}

async function getMonthHistoryData(userId, year, month) {
  const result = await MonthHistory.aggregate([
    { $match: { userId, year, month } },
    {
      $group: {
        _id: "$day",
        expense: { $sum: "$expense" },
        income: { $sum: "$income" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (result.length === 0) return [];

  const history = [];
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));

  for (let i = 1; i <= daysInMonth; i++) {
    const dayData = result.find((row) => row._id === i);
    history.push({
      _id: i,
      year,
      month: month - 1,
      day: i,
      expense: dayData ? dayData.expense : 0,
      income: dayData ? dayData.income : 0,
    });
  }

  //   console.log(history);
  return history;
}

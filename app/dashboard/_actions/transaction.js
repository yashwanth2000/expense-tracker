"use server";

import mongoose from "mongoose";
import { CreateTransactionSchema } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Transaction } from "@/models/TransactionModel";
import { Category } from "@/models/CategoryModel";
import { MonthHistory } from "@/models/MonthHistoryModel";
import { YearHistory } from "@/models/YearHistoryModel";

export async function CreateTransaction(form) {
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parsedBody.data;
  const categoryRow = await Category.findOne({
    userId: user.id,
    name: category,
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create Transaction document
    const transaction = await Transaction.create(
      [
        {
          userId: user.id,
          amount,
          date,
          description: description || "",
          type,
          category: categoryRow.name,
          categoryIcon: categoryRow.icon,
        },
      ],
      { session }
    );

    // Update or create MonthHistory
    await MonthHistory.findOneAndUpdate(
      {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
      {
        $inc: {
          expense: type === "expense" ? amount : 0,
          income: type === "income" ? amount : 0,
        },
      },
      { upsert: true, session }
    );

    // Update or create YearHistory
    await YearHistory.findOneAndUpdate(
      {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
      },
      {
        $inc: {
          expense: type === "expense" ? amount : 0,
          income: type === "income" ? amount : 0,
        },
      },
      { upsert: true, session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new Error("Transaction failed: " + error.message);
  } finally {
    session.endSession();
  }
}

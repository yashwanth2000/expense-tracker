import connectDB from "@/lib/mongodb";
import { MonthHistory } from "@/models/MonthHistoryModel";
import { YearHistory } from "@/models/YearHistoryModel";
import { Category } from "@/models/CategoryModel";
import { Transaction } from "@/models/TransactionModel";
import { UserSettings } from "@/models/UserSettingsModel";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const dbConnection = await connectDB();
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const userId = user.id;

    // Start a session for MongoDB operations
    const session = await dbConnection.connection.startSession();

    try {
      // First delete all MongoDB data
      await session.withTransaction(async () => {
        await Promise.all([
          Transaction.deleteMany({ userId }, { session }),
          Category.deleteMany({ userId }, { session }),
          MonthHistory.deleteMany({ userId }, { session }),
          YearHistory.deleteMany({ userId }, { session }),
          UserSettings.deleteOne({ userId }, { session }),
        ]);
      });

      // After MongoDB deletion succeeds, delete the user from Clerk
      const client = await clerkClient();
      client.users.deleteUser(userId);

      await session.endSession();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account and all associated data deleted successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      // If any operation fails, abort the transaction
      await session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting account:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete account",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { UserSettings } from "@/models/UserSettingsModel";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "@/app/dashboard/_components/CreateTransactionDialog";
import connectDB from "@/lib/mongodb";
import Overview from "@/app/dashboard/_components/Overview";
import History from "@/app/dashboard/_components/History";

async function page() {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await UserSettings.findOne({ userId: user.id }).lean();

  if (userSettings === null) {
    redirect("/wizard");
  }

  // Convert the Mongoose document to a plain object with serialized values
  const serializedSettings = {
    ...userSettings,
    _id: userSettings._id.toString(),
    createdAt: userSettings.createdAt.toISOString(),
  };

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold tracking-tight">
            Hello, {user?.firstName}! 👋
          </p>
          <div className="flex items-center gap-2">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New Income 💰
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                >
                  New Expense 💸
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={serializedSettings} />
      <History userSettings={serializedSettings} />
    </div>
  );
}

export default page;

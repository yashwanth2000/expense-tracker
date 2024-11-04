"use server";

import { updateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserSettings } from "@/models/UserSettingsModel";

export async function updateUserCurrency(currency) {
  const parsedBody = updateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // First get the current settings
  const currentSettings = await UserSettings.findOne({ userId: user.id });

  // If currency is the same, return without updating
  if (currentSettings?.currency === parsedBody.data.currency) {
    return {
      currency: currentSettings.currency,
    };
  }

  const userSettings = await UserSettings.findOneAndUpdate(
    { userId: user.id },
    { currency: parsedBody.data.currency},
    { new: true }
  );

  return {
    currency: userSettings.currency,
  };
}

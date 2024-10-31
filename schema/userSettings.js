import { Currencies } from "@/lib/curriences";
import { z } from "zod";

export const updateUserCurrencySchema = z.object({
  currency: z.string((value) => {
    const found = Currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`Invalid currency: ${value}`);
    }

    return value;
  }),
});

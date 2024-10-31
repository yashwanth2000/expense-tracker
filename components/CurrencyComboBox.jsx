"use client";

import * as React from "react";
import { Currencies } from "@/lib/curriences";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { updateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState(null);

  const queryClient = useQueryClient();

  const userSettings = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const response = await fetch("/api/user-settings");
      const data = await response.json();
      return data;
    },
  });

  React.useEffect(() => {
    if (userSettings.data && userSettings.data.currency) {
      const userCurrency = Currencies.find(
        (currency) => currency.value === userSettings.data.currency
      );
      if (userCurrency) {
        setSelectedOption(userCurrency);
      }
    }
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: updateUserCurrency,

    onSuccess: (data) => {
      queryClient.invalidateQueries(["user-settings"]);

      toast.success("Currency updated successfully 🎉", {
        id: "update-currency",
        duration: 1000,
      });

      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update currency", {
        id: "update-currency",
        duration: 1000,
      });
    },
  });

  const selectOption = React.useCallback(
    (currency) => {
      if (!currency) {
        toast.error("Please select a currency", {
          duration: 1000,
        });
        return;
      }

      // Don't update if selected currency is same as current
      if (selectedOption?.value === currency.value) {
        toast.info("Currency already set to " + currency.label, {
          duration: 1000,
        });
        return;
      }

      toast.loading("Updating currency...", {
        id: "update-currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation, selectedOption]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({ setOpen, setSelectedOption }) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={() => {
                setSelectedOption(currency);
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

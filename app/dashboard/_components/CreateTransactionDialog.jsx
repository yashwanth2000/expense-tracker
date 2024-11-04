"use client";

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { CreateTransactionSchema } from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CreateTransaction } from "../_actions/transaction";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DateToUTCDate } from "@/lib/helpers";
import { toast } from "sonner";

function CreateTransactionDialog({ type, trigger }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      date: new Date(),
      type,
    },
  });

  const handleCategoryChange = useCallback(
    (value) => {
      form.setValue("category", value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      console.log("Success handler called:");

      toast.dismiss("create-transaction-loading");

      toast.success("Transaction created successfully 🎉", {
        id: "create-transaction-success",
        duration: 1000,
      });

      // After creating a transaction,we need to invalidate the overview query which will refetch data in the homepage
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        category: undefined,
        date: new Date(),
      });

      setOpen(false);
    },
    onError: (error) => {
      console.log("Error handler called:", error);
      toast.dismiss("create-transaction-loading");

      toast.error("Failed to create transaction", {
        id: "create-transaction-error",
        duration: 1000,
      });
    },
  });

  const onSubmit = useCallback(
    (values) => {
      toast.loading("Creating transaction...", {
        id: "create-transaction-loading",
        duration: 1000,
      });

      mutate({
        ...values,
        date: DateToUTCDate(values.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
            transaction
          </DialogTitle>
          <DialogDescription>
            Enter the details for your new {type} transaction
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={""}
                      {...field}
                      placeholder={
                        type === "income"
                          ? "e.g., Monthly salary payment"
                          : "e.g., Weekly grocery shopping"
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Transaction description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      // defaultValue={0}
                      type="number"
                      {...field}
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (required)
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-2">Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select Category for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-2">Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return;
                            // console.log("Selected Date", value);
                            field.onChange(value);
                          }}
                          initialFocus
                          className={
                            "rounded-md border light:bg-white dark:bg-black"
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select date for this transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

CreateTransactionDialog.propTypes = {
  type: PropTypes.oneOf(["income", "expense"]).isRequired,
  trigger: PropTypes.node.isRequired,
};

export default CreateTransactionDialog;

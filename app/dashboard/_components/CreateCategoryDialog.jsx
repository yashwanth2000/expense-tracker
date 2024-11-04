"use client";

import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategorySchema } from "@/schema/categories";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleOff, Loader2, PlusSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateCategory } from "../_actions/categories";
import { useTheme } from "next-themes";

function CreateCategoryDialog({ type, successCallback }) {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data) => {
      // console.log('Success handler called:', data);
      // First dismiss the loading toast
      toast.dismiss("create-category");

      // Show success toast immediately
      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: "create-category-success",
      });

      // Then handle the state updates
      await queryClient.invalidateQueries(["categories", type]);
      successCallback(data);
      form.reset({
        name: "",
        icon: "",
        type,
      });

      setOpen(false);
    },
    onError: (error) => {
      // console.log('Error handler called:', error);
      toast.dismiss("create-category");

      toast.error("Failed to create category", {
        id: "create-category-error",
      });
    },
  });

  const onSubmit = useCallback(
    (values) => {
      toast.loading("Creating category...", {
        id: "create-category",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <PlusSquareIcon className="mr-2 h-4 w-4" />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {type}
            </span>
            category
          </DialogTitle>
          <DialogDescription>
            Categories are used to categorize your transactions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Select Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        type === "income"
                          ? "e.g., Salary, Freelance"
                          : "e.g., Groceries, Rent"
                      }
                    />
                  </FormControl>
                  <FormDescription>Name of the category</FormDescription>
                </FormItem>
              )}
            />

            {/* Select Category Icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        side="bottom"
                        className="max-h-[300px]"
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji) => {
                            field.onChange(emoji.native);
                            setPopoverOpen(false);
                          }}
                          theme={theme.resolvedTheme}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is the icon that will be displayed in the transaction
                  </FormDescription>
                </FormItem>
              )}
            />
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

CreateCategoryDialog.propTypes = {
  type: PropTypes.oneOf(["income", "expense"]).isRequired,
  successCallback: PropTypes.func.isRequired,
};
export default CreateCategoryDialog;

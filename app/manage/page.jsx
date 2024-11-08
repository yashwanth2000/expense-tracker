"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import CreateCategoryDialog from "../dashboard/_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import DeleteCategoryDialog from "@/app/manage/_components/DeleteCategoryDialog";
import DeleteAccountDialog from "@/app/manage/_components/DeleteAccountDialog";

function page() {
  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 ">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
      {/* End Header */}

      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold">Danger Zone</h2>
        <p className="text-muted-foreground mb-2">
          Delete your account and all associated data.
        </p>
        <DeleteAccountDialog
          trigger={
            <Button
              variant="destructive"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md transition-all duration-300 ease-in-out transform hover:bg-red-700 hover:scale-105 hover:border-2 hover:border-red-800"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete Account
            </Button>
          }
        />
      </div>
    </>
  );
}

export default page;

function CategoryList({ type }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const response = await fetch(`/api/categories?type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                {type === "income" ? "Incomes" : "Expenses"} Categories
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>
            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create Category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "expense" ? "text-red-500" : "text-emerald-500"
                )}
              >
                {type === "expense" ? "Expenses" : "Incomes"}
              </span>{" "}
              categories yet
            </p>

            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }) {
  return (
    <div className="flex justify-between items-center rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1] p-4">
      <div className="flex items-center gap-4">
        <span role="img" className="text-3xl">
          {category.icon}
        </span>
        <span className="text-lg">{category.name}</span>
      </div>

      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            variant="destructive"
            className="inline-flex items-center px-4 py-2 bg-transparent text-red-600 text-sm font-medium rounded-md transition-all duration-300 ease-in-out hover:bg-red-600 hover:text-white"
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </Button>
        }
      />
    </div>
  );
}

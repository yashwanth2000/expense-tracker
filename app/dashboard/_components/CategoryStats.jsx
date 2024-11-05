"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { DateToUTCDate } from "@/lib/helpers";
import { GetFormattedStats } from "@/lib/helpers";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

function CategoryStats({ userSettings, from, to }) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: async () => {
      const response = await fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      return await response.json();
    },
  });

  const formatter = useMemo(() => {
    return GetFormattedStats(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

CategoryStats.propTypes = {
  userSettings: PropTypes.object,
  from: PropTypes.instanceOf(Date).isRequired,
  to: PropTypes.instanceOf(Date).isRequired,
};
export default CategoryStats;

function CategoriesCard({ formatter, type, data }) {
  const filteredData = data.filter((d) => d._id.type === type);
  const total = filteredData.reduce((acc, d) => acc + (d.totalAmount || 0), 0);

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data for the selected period
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex flex-col gap-4 p-4 w-full">
              {filteredData.map((item) => {
                const amount = item.totalAmount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div className="flex flex-col gap=2" key={item.category}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item._id.categoryIcon}
                        {item._id.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}

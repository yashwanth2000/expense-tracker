"use client";

import React from "react";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function HistoryPeriodSelector({ period, setPeriod, timeFrame, setTimeFrame }) {
  const historyPeriods = useQuery({
    queryKey: ["overview", "history", "periods"],
    queryFn: async () => {
      const response = await fetch("/api/history-periods");
      if (!response.ok) {
        throw new Error("Failed to fetch history periods");
      }
      return await response.json();
    },
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value)}>
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriods.isFetching}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeFrame === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
}

HistoryPeriodSelector.propTypes = {
  period: PropTypes.object,
  setPeriod: PropTypes.func,
  timeFrame: PropTypes.string,
  setTimeFrame: PropTypes.func,
};
export default HistoryPeriodSelector;

function YearSelector({ period, setPeriod, years }) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MonthSelector({ period, setPeriod }) {
  return (
    <Select
      value={period.month.toString()} // No need to adjust here since `period.month` already uses 1-12
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
          const monthStr = new Date(
            period.year,
            month - 1,
            1
          ).toLocaleDateString("default", { month: "long" });
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

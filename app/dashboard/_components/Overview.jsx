"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { startOfMonth } from "date-fns";
import PropTypes from "prop-types";
import React, { useState } from "react";
import StatsCards from "@/app/dashboard/_components/StatsCards";
import CategoryStats from "@/app/dashboard/_components/CategoryStats";

function Overview({ userSettings }) {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={({ range }) => {
              const { from, to } = range;
              // console.log("onUpdate called with:", { from, to }); // Add this log

              if (!from || !to) return;

              const dayDifference = differenceInDays(to, from);
              console.log("Day difference:", dayDifference); // Add this log

              if (dayDifference > MAX_DATE_RANGE_DAYS) {
                // console.log("Attempting to show error toast"); // Add this log
                toast.error(
                  `The selected range is too large. Max date range is ${MAX_DATE_RANGE_DAYS} days`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="container flex w-full flex-col gap-2">
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoryStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
}

Overview.propTypes = {
  userSettings: PropTypes.object,
};

export default Overview;

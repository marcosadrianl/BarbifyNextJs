"use client";

import { BarberTable } from "@/components/barbertable";
import React from "react";
import CalendarDemo from "@/components/calendarDemo";
import { ChartAreaInteractive } from "@/components/ui/areaChartDashBoard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 grow h-full bg-[#cebaa1] w-full">
      <div className="flex flex-row gap-8">
        <CalendarDemo />
        <BarberTable />
      </div>
      <div className="">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}

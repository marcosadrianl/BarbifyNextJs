"use client";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm bg-[#ffe7c7]"
      captionLayout="dropdown"
    />
  );
}

//the page itself

export default function DashboardPage() {
  return (
    <div className="p-4 bg-[#cebaa1] flex-grow h-full">
      <CalendarDemo />
    </div>
  );
}

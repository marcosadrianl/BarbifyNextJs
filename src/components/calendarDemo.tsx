"use client";

import { Calendar } from "@/components/ui/calendar";
import React from "react";

export default function CalendarDemo() {
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

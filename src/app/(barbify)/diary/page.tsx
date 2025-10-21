"use client";
import Calendar from "@/components/calendar";

export default function Home() {
  return (
    <div className="flex flex-row p-4 w-full overflow-auto">
      <div className="w-3/4">
        <Calendar />
      </div>
      <div className="px-4 w-1/2 overflow-y-auto no-scrollbar">
        <h1 className="text-2xl q1 h-[1000px] font-semibold">Servicios</h1>
      </div>
    </div>
  );
}

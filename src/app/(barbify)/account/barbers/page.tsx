"use client";

import BarbersInfo from "@/components/barbersInfo";
import NewBarber from "@/components/newBarber";

export default function Page() {
  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold mb-4 p-4">Barbers</h1>
      <p className="text-gray-400 mb-6 px-4">
        Ve la información sobre los Barbers.
      </p>
      <BarbersInfo />
    </div>
  );
}

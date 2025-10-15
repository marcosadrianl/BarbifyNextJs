"use client";

import Skeleton from "react-loading-skeleton";

function SkeletonRow() {
  return (
    <tr>
      <td className="flex flex-row px-4 py-1.5 gap-2 items-center">
        <Skeleton circle width={25} height={25} baseColor="#cdaa7e" />
        <Skeleton width={200} height={20} baseColor="#cdaa7e" />
      </td>
      <td className="px-4 py-1.5">
        <Skeleton width={200} height={20} baseColor="#cdaa7e" />
      </td>
      <td className="px-4 py-1.5">
        <Skeleton width={200} height={20} baseColor="#cdaa7e" />
      </td>
      <td className="px-4 py-1.5">
        <Skeleton width={40} height={20} borderRadius={8} baseColor="#cdaa7e" />
      </td>
    </tr>
  );
}

export default function ClientsTableSkeleton() {
  return (
    <div className="px-2">
      <table className="w-full rounded-md overflow-hidden">
        <thead className="bg-[#cdaa7e]">
          <tr>
            <th className="text-lg px-4 py-2 text-left">Cliente</th>
            <th className="text-lg px-4 py-2 text-left">Email</th>
            <th className="text-lg px-4 py-2 text-left">Teléfono</th>
            <th className="text-lg px-4 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody className="bg-[#ffd49d]">
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonRow key={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

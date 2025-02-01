"use client";

import { cn } from "@/lib/utils";

export default function PetList() {
  return (
    <ul className="bg-white border-b border-light">
      <li>
        <button
          className={cn(
            "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition",
          )}
        >
          Pet
        </button>
      </li>
    </ul>
  );
}

"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePetContext } from "@/lib/hooks";

export default function PetList() {
  const { pets } = usePetContext();

  return (
    <ul className="bg-white border-b border-light">
      {pets.map((pet) => (
        <li key={pet.id}>
          <button
            className={cn(
              "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition",
            )}
          >
            <Image
              src={pet.imageUrl}
              alt="Pet image"
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}

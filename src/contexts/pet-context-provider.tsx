"use client";

import { createContext, useState } from "react";
import { Pet } from "@/lib/types";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{ pets, selectedPetId, selectedPet, handleChangeSelectedPetId }}
    >
      {children}
    </PetContext.Provider>
  );
}

"use client";

import { createContext, useState, useOptimistic } from "react";
import { Pet } from "@/lib/types";
import { addPet, deletePet, editPet } from "@/actions/actions";
import { toast } from "sonner";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  handleAddPet: (newPet: Pet) => void;
  handleEditPet: (petId: string, newPet: Pet) => void;
  handleCheckoutPet: (id: string) => void;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random().toString() }];
        case "edit":
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    },
  );
  console.log(optimisticPets, "pets");
  const selectedPet = optimisticPets?.find((pet) => pet.id === selectedPetId);
  console.log(selectedPet, "selectedPet");

  const handleAddPet = async (newPet) => {
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };
  const handleEditPet = async (petId: Pet["id"], newPetData) => {
    setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };
  const handleCheckoutPet = async (petId: Pet["id"]) => {
    setOptimisticPets({ action: "delete", payload: petId });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };
  const handleChangeSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        handleAddPet,
        handleCheckoutPet,
        handleEditPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

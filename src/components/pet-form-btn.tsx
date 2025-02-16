import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  const status = useFormStatus();

  return (
    <Button disabled={status.pending} type="submit" className="mt-5 self-end">
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
}

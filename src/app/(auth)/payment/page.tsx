"use client";

import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createCheckoutSession } from "@/actions/actions";
import { useSession } from "next-auth/react";

export default function Page({
                               searchParams,
                             }: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>

      {searchParams.success && (
        <Button
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
          disabled={status === "loading" || session?.user.hasAccess}
        >
          Access PetSoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          onClick={async () => {
            startTransition(async () => await createCheckoutSession());
          }}
          disabled={isPending}
        >
          Buy lifetime access for $49
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled. You can try again.
        </p>
      )}
    </main>
  );
}
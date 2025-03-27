import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
import prisma from "@/lib/db";
import { Toaster } from "@/components/ui/sonner";
import { checkAuth } from "@/lib/server-utils";

export default async function Layout({ children }: {
  children: React.ReactNode;
}) {
  const session = await checkAuth();

  const petsData = await prisma.pet.findMany({
    where: {
      userId: session.user?.id,
    },
  });
  console.log(petsData);
  console.log(session.user, "session.user");

  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider data={petsData}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>

      <Toaster position="bottom-right" />
    </>
  );
}

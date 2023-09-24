"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <section className="w-full h-screen py-[50%] md:py-24 lg:py-32 xl:py-48 bg-black relative">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-heading1-bold font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-700">
                FinancIA
              </h1>
              <h2 className="max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
                Tu mentor financiero personal
              </h2>
            </div>
            <div className="w-full max-w-sm space-y-2 mx-auto">
              {isLoading ? (
                <Spinner />
              ) : (
                <Button
                  className="bg-white text-black"
                  type="button"
                  onClick={() => {
                    router.push(`${isSignedIn ? "/dashboard" : "/sign-in"}`);
                    setIsLoading(true);
                  }}
                >
                  {isSignedIn ? "Ir a Dashboard" : "Iniciar Sesión"}
                </Button>
              )}

              <p className="text-xs text-zinc-200 dark:text-zinc-100 absolute bottom-10">
                Conoce nuestros{" "}
                <Link
                  className="underline underline-offset-2 text-white"
                  href="/terms-and-conditions"
                >
                  Términos y Condiciones
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

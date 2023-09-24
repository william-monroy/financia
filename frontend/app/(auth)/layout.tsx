import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "../globals.css";
import Image from "next/image";

export const metadata = {
  title: "FinancIA",
  description: "Your personal financial mentor",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-dark-1`}>
        <ClerkProvider>
          <Image
            src="/assets/banorte-background.jpeg"
            alt="Banorte"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            quality={100}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          <main className="h-screen flex justify-center items-center ">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}

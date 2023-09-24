import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinancIA",
  description: "Your personal financial mentor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning={true}>
        <body className={inter.className}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div id="app-root">{children}</div>
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

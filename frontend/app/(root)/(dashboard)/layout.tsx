import "../../globals.css";
import type { Metadata } from "next";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";

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
    <>
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar />

        <section className="main-container px-0">
          <div className="w-full">{children}</div>
        </section>
        <RightSidebar />
      </main>
      <Bottombar />
    </>
  );
}

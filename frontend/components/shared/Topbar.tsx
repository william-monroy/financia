import {
  OrganizationSwitcher,
  SignedIn,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";
import { ModeToggle } from "../ui/mode-toggle";

export const metadata = {
  title: "FinancIA",
  description: "Your personal financial mentor",
};

function Topbar() {
  return (
    <nav className="topbar w-screen">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.jpeg" alt="logo" width={48} height={28} />
        <p className="hidden md:block text-heading3-bold text-light-1 max-xs:hidden">
          FinancIA
        </p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <div className="flex gap-2 items-center justify-center">
          {/* <ModeToggle /> */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              baseTheme: dark,
              elements: {
                organzationSwitcherTrigger: "py-2 px-4",
              },
            }}
            showName={false}
          />
        </div>
      </div>
    </nav>
  );
}

export default Topbar;

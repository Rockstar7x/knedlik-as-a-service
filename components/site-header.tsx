import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "@/components/auth/user-menu";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between p-6">
      <Link href="/" className="font-semibold">
        Knedlík as a Service
      </Link>
      {/* UserMenu suspends on the user promise; the rest of the header is static. */}
      <Suspense fallback={<div className="h-8" />}>
        <UserMenu />
      </Suspense>
    </header>
  );
}

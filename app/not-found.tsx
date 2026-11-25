import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

// Unknown URLs and every notFound() call in the app.
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 pb-24">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="text-6xl font-semibold tracking-tight text-primary">
          404
        </h1>
        <p className="text-muted-foreground">This page could not be found.</p>
        <Link href="/" className={buttonVariants({ className: "mt-2" })}>
          Back to home
        </Link>
      </div>
    </main>
  );
}

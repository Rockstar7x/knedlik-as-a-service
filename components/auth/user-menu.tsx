"use client";

import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "./user-provider";

export function UserMenu() {
  const user = useUser();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link
          href="/auth/login"
          className={buttonVariants({ variant: "ghost" })}
        >
          Log in
        </Link>
        <Link href="/auth/sign-up" className={buttonVariants()}>
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">
        {user.name ?? user.email}
      </span>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Log out
        </Button>
      </form>
    </div>
  );
}

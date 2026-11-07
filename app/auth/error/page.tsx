import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function ErrorMessage({
  searchParams,
}: {
  searchParams: PageProps<"/auth/error">["searchParams"];
}) {
  const { error } = await searchParams;
  return <p>{typeof error === "string" ? error : "Unknown error."}</p>;
}

export default function AuthErrorPage({
  searchParams,
}: PageProps<"/auth/error">) {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <Suspense fallback={<p>&nbsp;</p>}>
            <ErrorMessage searchParams={searchParams} />
          </Suspense>
          <Link href="/auth/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

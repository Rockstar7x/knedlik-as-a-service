import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      {/* LoginForm reads ?next= from the URL, which is request-time data. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

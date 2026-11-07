import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "@/components/auth/user-provider";
import { SiteHeader } from "@/components/site-header";
import { getMyProfile } from "@/lib/data/profiles";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Knedlík as a Service";
const description =
  "Knedlík as a Service (KaaS) is a web app that uses AI to generate a personalized weekly meal plan with recipes, approximate nutritional values and an automatically merged shopping list.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | KaaS",
  },
  description,
  metadataBase: new URL("https://knedlik-as-a-service.vercel.app"),
  openGraph: {
    title,
    description,
    siteName: "KaaS",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Started here but NOT awaited, so nothing waits for it except the Client
  // Components that read it via useUser() (each behind its own <Suspense>).
  const userPromise = getMyProfile();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <UserProvider userPromise={userPromise}>
          <SiteHeader />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

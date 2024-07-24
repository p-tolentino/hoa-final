import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HOA MIS",
  description: "HOA MIS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={montserrat.className}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}

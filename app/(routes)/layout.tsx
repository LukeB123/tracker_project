import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@/app/globals.css";

import StoreProvider from "@/app/StoreProvider";
import TopNav from "@/app/_components/top-nav/top-nav";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prospero Tracker",
  description: "Next.js Tracker for Prospero data input.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body className="font-dxc">
        <StoreProvider>
          <TopNav />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

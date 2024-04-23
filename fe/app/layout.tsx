import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fluint app",
  description: "CRUD data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav className="p-2 flex justify-end border-b-2">
            <Link className="pr-2" href={"/"}>
              Home
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

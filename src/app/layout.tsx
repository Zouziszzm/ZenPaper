import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Template Maker | Jappaper",
  description: "A premium builder for practice paper templates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}>
        {children}
      </body>
    </html>
  );
}

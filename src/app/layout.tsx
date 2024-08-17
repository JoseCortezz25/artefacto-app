import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.scss";
import { AI } from "@/actions/chat";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artefacto",
  description: "Busca en internet y encuentra lo que necesitas"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AI>
          <main>
            {children}
          </main>
          <Toaster richColors />
        </AI>
      </body>
    </html>
  );
}

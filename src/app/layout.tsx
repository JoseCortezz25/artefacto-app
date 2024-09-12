import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.scss";
import { AI } from "@/actions/chat";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

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
      <body className={cn(montserrat.className, 'dark:bg-[#212121]')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AI>

            <main>
              {children}
            </main>
            <Toaster richColors />
          </AI>
        </ThemeProvider>
      </body>
    </html>
  );
}

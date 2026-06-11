import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { inter, lato } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "SERVI ADS",
  description:
    "Maintenant vous pouvez faire de la publicité pour votre entreprise dans les taxis et autres places en quelques clics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full",
        "antialiased",
        lato.className,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main>{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

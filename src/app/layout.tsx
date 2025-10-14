"use client";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Header } from "@/components";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning>
        <Providers>
          <Header />
            {children}
        </Providers>
      </body>
    </html>
  );
}

function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

"use client";

import * as React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar />
      <main className="bg-background flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}

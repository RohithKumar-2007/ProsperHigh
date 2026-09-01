"use client";

import React, { useState, Suspense } from "react";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { GuidedTour } from "@/components/GuidedTour";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>ProsperHigh — Explainable Multi-Agent Investment Intelligence</title>
        <meta name="description" content="Understand your investments. Understand why." />
      </head>
      <body className="bg-background text-charcoal flex min-h-screen">
        {/* Left Navigation Shell */}
        <Sidebar onStartTour={() => setIsTourOpen(true)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <TopHeader />

          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            {children}
          </main>

          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
            <p className="font-bold text-primary">PROSPERHIGH — Decision Intelligence Platform v3.0</p>
            <p>Understand your investments. Understand why. Model-Agnostic Multi-Agent Architecture.</p>
          </footer>
        </div>

        {/* Interactive Guided Tour Overlay wrapped in Suspense boundary */}
        <Suspense fallback={null}>
          <GuidedTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
        </Suspense>
      </body>
    </html>
  );
}

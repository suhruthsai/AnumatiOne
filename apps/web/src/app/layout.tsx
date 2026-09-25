import type { Metadata } from 'next';
import './globals.css';
import { NavigationHeader } from '@/components/navbar/NavigationHeader';
import { LiveEventStream } from '@/components/realtime/LiveEventStream';
import { RegulatoryAIChatbot } from '@/components/chat/RegulatoryAIChatbot';
import JuryTourBanner from '@/components/common/JuryTourBanner';

export const metadata: Metadata = {
  title: 'AnumatiOne | Regulatory Digital Twin & Compliance Platform',
  description: 'Unified intelligent industrial approval and compliance management platform with Adversarial Path Optimization and interactive DAG Gantt journey map.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <NavigationHeader />
        <LiveEventStream />
        <main className="min-h-[calc(100vh-4rem)] pb-16">
          {children}
        </main>
        <RegulatoryAIChatbot />
        <JuryTourBanner />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { NavigationHeader } from '@/components/navbar/NavigationHeader';
import { StatePortalFooter } from '@/components/footer/StatePortalFooter';
import { RegulatoryAIChatbot } from '@/components/chat/RegulatoryAIChatbot';

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
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-[#C33764] selection:text-white flex flex-col min-h-screen">
        <NavigationHeader />
        <main className="flex-1">
          {children}
        </main>
        <StatePortalFooter />
        <RegulatoryAIChatbot />
      </body>
    </html>
  );
}

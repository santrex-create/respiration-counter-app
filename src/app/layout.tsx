import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Respiration Rate Monitor',
  description: 'Monitor your respiration rate and get smart wellbeing advice.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-grow">{children}</div>
          <footer className="fixed bottom-4 right-4 text-xs text-muted-foreground">
            Created by Omkar Gaikwad
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

// layout.tsx
// Root layout dell'applicazione Next.js

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veo 3.1 Video Generator',
  description: 'Genera video professionali con AI utilizzando Veo 3.1 di Google',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}

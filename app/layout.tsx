import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Living Archive - Project Genesis',
  description: 'A self-organizing, decentralized creative consciousness ecosystem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}

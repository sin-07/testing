import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Examination Management System',
  description: 'Online examination registration, slot allocation, and admit card generation system',
  keywords: ['examination', 'registration', 'admit card', 'exam slot', 'online exam'],
  authors: [{ name: 'Exam Portal Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}

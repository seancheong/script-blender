import { Header } from '@/components/Header';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '../lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Script Blender',
  description:
    'A web-based platform offers an innovative environment for developers to create, edit, and share JavaScript and TypeScript code snippets'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen bg-neutral-800 font-sans antialiased',
          inter.variable
        )}
      >
        <div>
          <Header />

          {children}
        </div>
      </body>
    </html>
  );
}

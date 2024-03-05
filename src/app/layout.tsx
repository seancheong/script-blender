import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '../lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const title = 'Script Blender';
const description =
  'A web-based platform offers an innovative environment for developers to create, edit, and share JavaScript and TypeScript code snippets';

export const metadata: Metadata = {
  title,
  description,
  keywords:
    'JavaScript, TypeScript, Coding, Programming, Code Editor, Monaco Editor, Interactive Coding, Web Development',
  authors: [
    { name: 'Sean Cheong Zhen Xiong', url: 'https://github.com/seancheong' },
  ],
  metadataBase: new URL('https://www.script-blender.com'),
  openGraph: {
    title,
    description,
    url: 'https://www.script-blender.com',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/screenshot.png`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/screenshot.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-neutral-800 font-sans antialiased',
          inter.variable,
        )}
      >
        <div>
          <Header />

          {children}
        </div>

        <Toaster />
      </body>
    </html>
  );
}

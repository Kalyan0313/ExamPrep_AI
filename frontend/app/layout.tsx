import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ExamPrep AI - AI-Powered Competitive Exam Preparation Platform',
  description: 'Generate unique quizzes from study material, track performance, and master weak concepts with adaptive retry AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable} ${outfit.variable}`}>
      <body className="bg-obsidian-bg text-obsidian-text antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}

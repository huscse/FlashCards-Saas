import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PromptWise',
  description: 'an AI-Powered flashcards generator',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="14193676-add3-4ddf-b12a-a48efc57e9cf"
          ></script>
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}

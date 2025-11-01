import './globals.css';
import Header from '@/components/header';
import { Providers } from './providers';

export const metadata = { title: 'CampusConnect' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

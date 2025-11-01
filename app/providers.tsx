// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Toaster />
        {children}
      </Suspense>
    </SessionProvider>
  );
}

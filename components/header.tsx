'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useStore } from '@/store/use-store';

export default function Header() {
  const { data: session } = useSession();
  const { role, toggleRole } = useStore();

  return (
    <header className="w-full border-b p-4 flex items-center justify-between">
      <Link href="/" className="font-bold">
        CampusConnect
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/jobs">Jobs</Link>
        {session?.user ? (
          <>
            <button onClick={toggleRole} className="px-3 py-1 border rounded">
              {role}
            </button>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 border rounded"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/signin">Sign in</Link>
            <Link href="/auth/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

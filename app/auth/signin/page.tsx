'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('Signed in');
      router.push('/dashboard');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl mb-4">Sign in</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
        />
        <button className="w-full p-3 bg-black text-white rounded">
          Sign in
        </button>
      </form>
      <div className="mt-4 flex gap-2">
        <button onClick={() => signIn('github')} className="p-2 border rounded">
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}

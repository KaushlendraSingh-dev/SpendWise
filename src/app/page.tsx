'use client'; // Required for redirect

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <p className="text-foreground">Loading SpendWise...</p>
      {/* You can add a spinner or loading animation here */}
    </div>
  );
}

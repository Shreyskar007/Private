"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { getFriends } from '@/app/actions';
import FriendScoreDashboard from '@/components/friend-score-dashboard';
import { Button } from '@/components/ui/button';
import type { Friend } from '@/lib/types';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [initialFriends, setInitialFriends] = useState<Friend[] | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      getFriends().then(setInitialFriends);
    }
  }, [user, router]);

  if (!user || !initialFriends) {
    // You can show a loading spinner here
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center text-center mb-12">
        <div className="flex-1 text-center">
            <h1 className="text-5xl font-bold font-headline tracking-tight text-primary-foreground">
            ChutScore
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
            Kitni ki le chuke ji?
            </p>
        </div>
        <div className="absolute top-4 right-4">
          <p className="text-sm text-muted-foreground mr-4">Welcome, {user.username}</p>
          <Button variant="outline" onClick={() => logout()}>
              Logout
          </Button>
        </div>
      </header>
      <FriendScoreDashboard initialFriends={initialFriends} />
    </main>
  );
}

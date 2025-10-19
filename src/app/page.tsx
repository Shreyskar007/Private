import { getFriends } from '@/app/actions';
import FriendScoreDashboard from '@/components/friend-score-dashboard';

export default async function Home() {
  const initialFriends = await getFriends();

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold font-headline tracking-tight text-primary-foreground">
          FriendScore
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Who's winning? Track your scores in real-time.
        </p>
      </header>
      <FriendScoreDashboard initialFriends={initialFriends} />
    </main>
  );
}

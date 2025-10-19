"use client";

import type { Friend } from "@/lib/types";
import { useState } from "react";
import { incrementScore } from "@/app/actions";
import FriendCard from "@/components/friend-card";
import ScoreChart from "@/components/score-chart";
import { useToast } from "@/hooks/use-toast";

export default function FriendScoreDashboard({ initialFriends }: { initialFriends: Friend[] }) {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const { toast } = useToast();

  const handleIncrement = async (friendId: number) => {
    if (isUpdating !== null) return;
    setIsUpdating(friendId);

    try {
      const updatedFriends = await incrementScore(friendId);
      setFriends(updatedFriends);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onIncrement={handleIncrement}
            isUpdating={isUpdating === friend.id}
          />
        ))}
      </div>
      <section>
        <h2 className="text-3xl font-bold font-headline text-center mb-8">Score History</h2>
        <ScoreChart friends={friends} />
      </section>
    </div>
  );
}

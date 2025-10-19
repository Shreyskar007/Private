"use client";

import type { Friend } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import Image from 'next/image';

interface FriendCardProps {
  friend: Friend;
  onIncrement: (id: number) => void;
  isUpdating: boolean;
}

export default function FriendCard({ friend, onIncrement, isUpdating }: FriendCardProps) {
  return (
    <Card
      className="flex flex-col justify-between shadow-lg border-none transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
      style={{ backgroundColor: friend.color }}
    >
      <CardHeader className="flex flex-col items-center justify-between pb-2 p-0">
        <div className="relative w-full h-48">
            <Image 
                src={friend.photoUrl} 
                alt={`${friend.name}'s profile picture`}
                fill
                style={{objectFit: 'cover'}}
                data-ai-hint="profile picture"
            />
        </div>
        <div className="flex flex-row items-center justify-between p-6 pb-2 w-full">
            <CardTitle className="text-2xl font-bold text-primary-foreground">{friend.name}</CardTitle>
            <Button
                size="icon"
                variant="ghost"
                className="text-primary-foreground/70 hover:bg-white/20 hover:text-primary-foreground rounded-full"
                onClick={() => onIncrement(friend.id)}
                disabled={isUpdating}
                aria-label={`Increment ${friend.name}'s score`}
                >
                {isUpdating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
            </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div key={friend.score} className="text-6xl font-bold text-primary-foreground animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
          {friend.score}
        </div>
      </CardContent>
    </Card>
  );
}

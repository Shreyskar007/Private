"use client";

import type { Friend } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
      <CardHeader className="p-0 flex items-center justify-center pt-6">
        <div className="relative w-[200px] h-[200px]">
            <Image 
                src={friend.photoUrl} 
                alt={`${friend.name}'s profile picture`}
                width={200}
                height={200}
                style={{objectFit: 'contain', borderRadius: '0.5rem'}}
                data-ai-hint="profile picture"
            />
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-2 flex-grow text-center">
        <CardTitle className="text-2xl font-bold text-primary-foreground">{friend.name}</CardTitle>
        <div key={friend.score} className="text-6xl font-bold text-primary-foreground animate-in fade-in-0 slide-in-from-bottom-5 duration-500 mt-2">
          {friend.score}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
            className="w-full text-primary-foreground/80 bg-white/10 hover:bg-white/20 hover:text-primary-foreground"
            onClick={() => onIncrement(friend.id)}
            disabled={isUpdating}
            aria-label={`Increment ${friend.name}'s score`}
            >
            {isUpdating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
            <span className="ml-2">Add Point</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

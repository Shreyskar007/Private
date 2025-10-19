'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Friend } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'friends.json');

export async function getFriends(): Promise<Friend[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const friends = JSON.parse(fileContent);
    return friends;
  } catch (error) {
    console.error('Failed to read friends data:', error);
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(dataFilePath, '[]', 'utf-8');
      return [];
    }
    throw new Error('Could not fetch friends.');
  }
}

export async function incrementScore(friendId: number): Promise<Friend[]> {
  try {
    const friends = await getFriends();
    let updatedFriends = [...friends];

    const friendIndex = updatedFriends.findIndex((f) => f.id === friendId);

    if (friendIndex === -1) {
      throw new Error('Friend not found.');
    }
    
    const friendToUpdate = { ...updatedFriends[friendIndex] };
    
    friendToUpdate.score += 1;
    friendToUpdate.scoreHistory.push({
      score: friendToUpdate.score,
      date: new Date().toISOString(),
    });
    
    updatedFriends[friendIndex] = friendToUpdate;

    await fs.writeFile(dataFilePath, JSON.stringify(updatedFriends, null, 2));
    
    revalidatePath('/');
    return updatedFriends;
  } catch (error) {
    console.error('Failed to increment score:', error);
    throw new Error('Could not update score.');
  }
}

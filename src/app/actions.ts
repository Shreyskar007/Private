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
      // If the file doesn't exist, create it with an empty array
      await fs.writeFile(dataFilePath, '[]', 'utf-8');
      return [];
    }
    throw new Error('Could not fetch friends.');
  }
}

export async function incrementScore(friendId: number): Promise<Friend[]> {
  try {
    const friends = await getFriends();
    const friendToUpdate = friends.find((f) => f.id === friendId);

    if (!friendToUpdate) {
      throw new Error('Friend not found.');
    }

    friendToUpdate.score += 1;
    friendToUpdate.scoreHistory.push({
      score: friendToUpdate.score,
      date: new Date().toISOString(),
    });

    await fs.writeFile(dataFilePath, JSON.stringify(friends, null, 2));

    revalidatePath('/');
    return friends;
  } catch (error) {
    console.error('Failed to increment score:', error);
    throw new Error('Could not update score.');
  }
}

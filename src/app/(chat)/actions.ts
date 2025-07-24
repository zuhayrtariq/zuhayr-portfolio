'use server';

import { cookies } from 'next/headers';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
} from '@/lib/db/queries';

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function setChatId(id: string) {
  const cookieStore = await cookies(); // ✅ No 'await' here
  cookieStore.set('chat-id', id, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}
export async function deleteChatId() {
  const cookieStore = await cookies(); // ✅ No 'await' here
  cookieStore.delete('chat-id');
}

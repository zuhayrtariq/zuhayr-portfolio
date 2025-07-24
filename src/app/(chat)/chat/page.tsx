import { Chat } from "@/components/chat";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const id = cookieStore.get("chat-id")?.value;

  if (!id) {
    const newId = generateUUID();
    return <Chat id={newId} initialMessages={[]} autoResume={true} />;
  }
  const chat = await getChatById({ id });
  if (!chat) {
    return <Chat id={id} initialMessages={[]} autoResume={true} />;
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  return <Chat id={chat.id} initialMessages={uiMessages} autoResume={true} />;
}

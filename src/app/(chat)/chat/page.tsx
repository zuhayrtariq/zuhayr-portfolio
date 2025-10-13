import { Chat } from "@/components/chat";
import { generateUUID } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const id = cookieStore.get("chat-id")?.value || generateUUID();

  // No database operations - just use session-based chat
  return <Chat id={id} initialMessages={[]} autoResume={false} />;
}

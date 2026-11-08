"use client";
import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { deleteChatId } from "@/app/(chat)/actions";

const ClearChatButton = () => {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-foreground/20 px-4 text-[15px] font-medium transition-colors hover:border-foreground disabled:opacity-60"
      onClick={async () => {
        setPending(true);
        await deleteChatId();
        window.localStorage.removeItem("input");
        window.location.assign("/chat");
      }}
    >
      <RotateCcwIcon className="size-4" aria-hidden />
      {pending ? "Starting…" : "New chat"}
    </button>
  );
};

export default ClearChatButton;

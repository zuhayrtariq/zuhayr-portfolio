"use client";
import React from "react";
import { Button } from "./ui/button";
import { deleteChatId } from "@/app/(chat)/actions";
import { toast } from "sonner";
const ClearChatButton = () => {
  return (
    <Button
      variant={"destructive"}
      className="cursor-pointer"
      onClick={async () => {
        await deleteChatId();
        toast.success("Chat Cleared");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }}
    >
      Clear Chat
    </Button>
  );
};

export default ClearChatButton;

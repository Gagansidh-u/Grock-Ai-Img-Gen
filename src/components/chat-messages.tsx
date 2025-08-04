"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { ChatMessage } from "@/components/chat-message";

type ChatMessagesProps = {
  messages: Message[];
  isLoading: boolean;
};

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollableContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <ChatMessage message={{ id: "loading", role: "assistant", content: "", type: "loading" }} />
        )}
      </div>
    </div>
  );
}

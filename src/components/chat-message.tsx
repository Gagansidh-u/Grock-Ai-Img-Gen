"use client";

import Image from "next/image";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GrockLogo } from "@/components/icons";
import { User } from "lucide-react";

type ChatMessageProps = {
  message: Message;
};

const LoadingBubble = () => (
  <div className="flex items-center justify-center">
    <div className="three-dots-loader">
      <span />
      <span />
      <span />
    </div>
  </div>
);

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border border-primary/20 bg-primary/10">
          <AvatarFallback className="bg-transparent">
            <GrockLogo className="h-6 w-6 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-xl w-full",
          isUser ? "order-1" : "order-2"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-secondary rounded-bl-none"
          )}
        >
          {message.type === 'loading' ? (
            <LoadingBubble />
          ) : message.type === 'image' ? (
            <Image
              src={message.content as string}
              alt="Generated image"
              width={400}
              height={400}
              className="rounded-lg"
              priority
            />
          ) : (
            <div className="prose prose-sm prose-p:text-current prose-strong:text-current prose-headings:text-current dark:prose-invert text-current break-words">
              {message.content}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 border border-border order-2">
           <AvatarFallback className="bg-muted">
              <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

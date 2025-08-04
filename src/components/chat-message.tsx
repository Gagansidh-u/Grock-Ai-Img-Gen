"use client";

import Image from "next/image";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { GrockLogo } from "@/components/icons";
import { User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border">
          <AvatarFallback>
            <GrockLogo className="h-6 w-6 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-md w-full",
          isUser ? "order-1" : "order-2"
        )}
      >
        <Card
          className={cn(
            "rounded-2xl",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted rounded-bl-none"
          )}
        >
          <CardContent className="p-3">
            {message.type === 'loading' ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ) : message.type === 'image' ? (
              <Image
                src={message.content as string}
                alt="Generated image"
                width={400}
                height={400}
                className="rounded-lg"
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert text-current break-words">
                {message.content}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 border order-2">
           <AvatarFallback>
              <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

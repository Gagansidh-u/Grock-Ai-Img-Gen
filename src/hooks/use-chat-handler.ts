"use client";

import { useState, useCallback } from "react";
import type { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fileToDataUri } from "@/lib/utils";
import { identityDisclosure } from "@/ai/flows/identity-disclosure";
import { generateImage } from "@/ai/flows/generate-image";
import { analyzeMedia } from "@/ai/flows/analyze-media";

export function useChatHandler() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  const { toast } = useToast();

  const handleSend = useCallback(async (userMessageText: string) => {
    if (isLoading) return;
    
    setIsLoading(true);

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: userMessageText,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    try {
      let assistantMessage: Message;

      if (attachedFile) {
        const mediaDataUri = await fileToDataUri(attachedFile);
        const response = await analyzeMedia({ mediaDataUri, question: userMessageText });
        assistantMessage = {
          id: `${userMessageId}-bot`,
          role: "assistant",
          content: response.answer,
        };

      } else if (/^(generate|create|draw|make an image of)/i.test(userMessageText)) {
        const response = await generateImage({ prompt: userMessageText });
        assistantMessage = {
          id: `${userMessageId}-bot`,
          role: "assistant",
          content: response.image,
          type: "image",
        };
      
      } else {
        const response = await identityDisclosure({ query: userMessageText });
        assistantMessage = {
          id: `${userMessageId}-bot`,
          role: "assistant",
          content: response.response,
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("AI request failed:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with the AI request. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setAttachedFile(null);
    }
  }, [isLoading, attachedFile, toast]);

  return {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    attachedFile,
    setAttachedFile,
  };
}

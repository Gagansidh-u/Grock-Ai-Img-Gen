"use client";

import { useRef, useEffect } from "react";
import { useChatHandler } from "@/hooks/use-chat-handler";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInputArea } from "@/components/chat-input-area";

export function ChatInterface() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    attachedFile,
    setAttachedFile,
  } = useChatHandler();

  const {
    isRecording,
    startRecognition,
    stopRecognition,
    text: transcript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  return (
    <div className="flex flex-col h-full flex-1">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInputArea
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        isRecording={isRecording}
        startRecording={startRecognition}
        stopRecording={stopRecognition}
        attachedFile={attachedFile}
        setAttachedFile={setAttachedFile}
      />
    </div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { useChatHandler } from "@/hooks/use-chat-handler";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInputArea } from "@/components/chat-input-area";
import { useSettings } from "./settings-provider";

export function ChatInterface() {
  const { voice } = useSettings();
  const {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    voiceOutputEnabled,
    toggleVoiceOutput,
    audioRef,
    attachedFile,
    setAttachedFile,
  } = useChatHandler({
    voice,
  });

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
      <audio ref={audioRef} className="hidden" />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInputArea
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        isRecording={isRecording}
        startRecording={startRecognition}
        stopRecording={stopRecognition}
        voiceOutputEnabled={voiceOutputEnabled}
        toggleVoiceOutput={toggleVoiceOutput}
        attachedFile={attachedFile}
        setAttachedFile={setAttachedFile}
      />
    </div>
  );
}

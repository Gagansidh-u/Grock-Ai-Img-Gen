"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Paperclip, Mic, MicOff, Volume2, VolumeX, X } from "lucide-react";

type ChatInputAreaProps = {
  input: string;
  setInput: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  voiceOutputEnabled: boolean;
  toggleVoiceOutput: () => void;
  attachedFile: File | null;
  setAttachedFile: (file: File | null) => void;
};

export function ChatInputArea({
  input,
  setInput,
  onSend,
  isLoading,
  isRecording,
  startRecording,
  stopRecording,
  voiceOutputEnabled,
  toggleVoiceOutput,
  attachedFile,
  setAttachedFile,
}: ChatInputAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || attachedFile) {
      onSend(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick(e as any);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };
  
  const attachedFileUrl = attachedFile ? URL.createObjectURL(attachedFile) : null;

  return (
    <div className="bg-transparent border-t border-border/50">
        <div className="container mx-auto max-w-4xl p-2 md:p-4">
          {attachedFile && attachedFileUrl && (
            <div className="mb-2 p-2 bg-muted/50 rounded-lg flex items-center gap-4 animate-in">
              {attachedFile.type.startsWith('image/') ? (
                 <Image src={attachedFileUrl} alt="Preview" width={48} height={48} className="rounded-md object-cover" />
              ) : (
                <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center">
                  <Paperclip className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 text-sm text-muted-foreground truncate">{attachedFile.name}</div>
              <Button variant="ghost" size="icon" onClick={() => setAttachedFile(null)} className="shrink-0 hover:bg-destructive/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Textarea
                ref={textAreaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  const el = e.target;
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Grock anything..."
                className="flex-1 resize-none border-border/80 bg-muted/30 focus-visible:ring-primary/50 text-base rounded-full pr-12 pl-12 py-3 min-h-[52px] max-h-48"
                rows={1}
                disabled={isLoading}
                aria-label="Chat input"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAttachClick}
                  disabled={isLoading}
                  aria-label="Attach file"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <Button
                  onClick={handleSendClick}
                  disabled={isLoading || (!input.trim() && !attachedFile)}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 rounded-full w-9 h-9"
                  aria-label="Send message"
                >
                  <SendHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <Button
              variant={isRecording ? 'destructive' : 'ghost'}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoiceOutput}
              aria-label={voiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              {voiceOutputEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*"
          />
        </div>
    </div>
  );
}

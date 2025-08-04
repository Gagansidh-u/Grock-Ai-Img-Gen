"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="bg-background/80 backdrop-blur-md border-t">
        <div className="container mx-auto max-w-4xl p-2 md:p-4">
          {attachedFile && attachedFileUrl && (
            <div className="mb-2 p-2 bg-muted rounded-lg flex items-center gap-4">
              {attachedFile.type.startsWith('image/') ? (
                 <Image src={attachedFileUrl} alt="Preview" width={48} height={48} className="rounded-md object-cover" />
              ) : (
                <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center">
                  <Paperclip className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 text-sm text-muted-foreground truncate">{attachedFile.name}</div>
              <Button variant="ghost" size="icon" onClick={() => setAttachedFile(null)} className="shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Card className="p-2 flex items-start gap-2 shadow-sm">
            <Textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Grock anything..."
              className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 max-h-48"
              rows={1}
              disabled={isLoading}
              aria-label="Chat input"
            />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAttachClick}
                disabled={isLoading}
                aria-label="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant={isRecording ? 'destructive' : 'ghost'}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
               <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoiceOutput}
                aria-label={voiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
              >
                {voiceOutputEnabled ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button
                onClick={handleSendClick}
                disabled={isLoading || (!input.trim() && !attachedFile)}
                size="icon"
                aria-label="Send message"
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </Card>
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

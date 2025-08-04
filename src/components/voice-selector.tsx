"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "./settings-provider";
import { voices } from "@/lib/voices";

export function VoiceSelector() {
  const { voice, setVoice } = useSettings();

  return (
    <Select value={voice} onValueChange={setVoice}>
      <SelectTrigger className="w-[180px] bg-muted/30 border-border/80 rounded-full">
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent>
        {voices.map((v) => (
          <SelectItem key={v.id} value={v.id}>
            {v.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

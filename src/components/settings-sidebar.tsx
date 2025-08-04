"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "./settings-provider";

const voices = [
  { id: "Algenib", name: "Algenib (Female)" },
  { id: "Achernar", name: "Achernar (Male)" },
  { id: "Antares", name: "Antares (Female)" },
  { id: "Arcturus", name: "Arcturus (Male)" },
  { id: "Capella", name: "Capella (Female)" },
  { id: "Castor", name: "Castor (Male)" },
  { id: "Deneb", name: "Deneb (Female)" },
  { id: "Fomalhaut", name: "Fomalhaut (Male)" },
];

type SettingsSidebarProps = {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
};

export function SettingsSidebar({ selectedVoice, onVoiceChange }: SettingsSidebarProps) {
  const { isSidebarOpen } = useSettings();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 288 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-secondary/50 border-l border-border/50 overflow-hidden"
        >
          <div className="p-4 w-[288px]">
            <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
            <ScrollArea className="h-[calc(100vh-150px)]">
              <RadioGroup
                value={selectedVoice}
                onValueChange={onVoiceChange}
                className="space-y-1"
              >
                {voices.map((voice) => (
                  <Label
                    key={voice.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <span>{voice.name}</span>
                    <RadioGroupItem value={voice.id} id={voice.id} />
                  </Label>
                ))}
              </RadioGroup>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "./settings-provider";

export function SettingsToggle() {
  const { toggleSidebar } = useSettings();

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle Settings">
      <Settings className="h-5 w-5" />
    </Button>
  );
}

"use client";

import React, { createContext, useState, useContext } from 'react';

type SettingsContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  voice: string;
  setVoice: (voice: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [voice, setVoice] = useState('Algenib');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
    voice,
    setVoice,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

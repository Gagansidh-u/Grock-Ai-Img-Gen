"use client";

import React, { createContext, useState, useContext } from 'react';

type SettingsContextType = {
  voice: string;
  setVoice: (voice: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [voice, setVoice] = useState('algenib');

  const value = {
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

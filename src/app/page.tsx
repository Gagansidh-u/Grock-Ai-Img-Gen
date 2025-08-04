import { Header } from "@/components/header";
import { ChatInterface } from "@/components/chat-interface";
import { SettingsProvider } from "@/components/settings-provider";

export default function Home() {
  return (
    <SettingsProvider>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <main className="flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </SettingsProvider>
  );
}

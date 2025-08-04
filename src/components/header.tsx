import { GrockLogo } from "@/components/icons";

export function Header() {
  return (
    <header className="border-b w-full border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 h-16">
          <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
            <GrockLogo className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tighter">
            Grock AI
          </h1>
        </div>
      </div>
    </header>
  );
}

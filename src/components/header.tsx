import { GrockLogo } from "@/components/icons";

export function Header() {
  return (
    <header className="border-b w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 h-16">
          <GrockLogo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Grock AI</h1>
        </div>
      </div>
    </header>
  );
}

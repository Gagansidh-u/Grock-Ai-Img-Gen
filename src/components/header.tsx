import Link from "next/link";
import { GrockLogo } from "@/components/icons";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
              <GrockLogo className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tighter">
              Grock AI
            </h1>
          </Link>

          <Link href="/generate">
            <Button>
                Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

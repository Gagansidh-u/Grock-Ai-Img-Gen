
import Link from "next/link";
import { TryQuadLogo } from "@/components/icons";
import { SidebarTrigger } from "./ui/sidebar";
import { AuthButton } from "./auth-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <Link href="/" className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <TryQuadLogo className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tighter">
                TryQuad AI
              </h1>
            </Link>
          </div>
          <div className="hidden md:block">
            <AuthButton />
          </div>
           <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </header>
  );
}

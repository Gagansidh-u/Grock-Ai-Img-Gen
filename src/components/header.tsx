
import Link from "next/link";
import Image from 'next/image';
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
                <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png" alt="Logo" width={32} height={32} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tighter">
                TryQuad AI
              </h1>
            </Link>
          </div>
          <div className="hidden md:block">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}

    
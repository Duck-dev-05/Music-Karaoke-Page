
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Karaoke Music</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Home
            </Link>
            <Link
              href="/songs"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/songs" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Songs
            </Link>
            <Link
              href="/karaoke"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/karaoke" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Karaoke
            </Link>
            <Link
              href="/playlists"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/playlists" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Playlists
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

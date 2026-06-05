import Link from "next/link";

import { cn } from "@/lib/utils";

type HomeConnectLogoProps = {
  className?: string;
};

export function HomeConnectLogo({ className }: HomeConnectLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "font-display text-xl font-bold text-primary transition-opacity hover:opacity-80",
        className,
      )}
    >
      HomeConnect
    </Link>
  );
}

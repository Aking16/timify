import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg ">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 text-primary"
          >
            <path d="M15 2H10" />
            <path d="M4 13.5C4 8.80558 7.80558 5 12.5 5C14.8472 5 16.9722 5.95139 18.5104 7.48959M18.5104 7.48959C20.0486 9.02779 21 11.1528 21 13.5C21 18.1944 17.1944 22 12.5 22H3M18.5104 7.48959L20 6" />
            <path d="M8 19H3" />
            <path d="M6 16H3" />
            <path d="M12.5 13.5L16 10" />
          </svg>
          تایمیفای
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth">ورود</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth?tab=register">ثبت‌نام</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

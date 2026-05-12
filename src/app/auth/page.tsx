"use client";

import { placeholderImage } from "@/constants/placeholder-image";
import { Timer02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { LoginForm } from "./components/login-form";
import { RegisterForm } from "./components/register-form";

export default function AuthPage() {
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <HugeiconsIcon icon={Timer02Icon} size={16} strokeWidth={2} />
            </div>
            تایمیفای
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {tab === "register" ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={placeholderImage}
          alt="Image"
          loading="eager"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

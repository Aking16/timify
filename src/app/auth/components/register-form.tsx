import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { defaultRoutes } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitEvent } from "react";
import { toast } from "sonner";

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      password: string;
    };

    let loadingToastId: string | number;

    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: defaultRoutes.authRedirectPage,
      },
      {
        onRequest: () => {
          loadingToastId = toast.loading("بارگذاری...");
        },
        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("حساب با موفقیت ساخته شد!");
          redirect(defaultRoutes.authRedirectPage);
        },
        onError: (ctx) => {
          toast.dismiss(loadingToastId);
          toast.error(ctx.error.message);
        },
      }
    );
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">حساب خود را بسازید</h1>
          <p className="text-muted-foreground text-sm text-balance">
            با ساخت حساب از امکانات تایمیفای بهره مند شوید
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">نام کاربری</FieldLabel>
          <Input id="name" type="text" name="name" placeholder="Aking" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">ایمیل</FieldLabel>
          <Input id="email" type="email" name="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
          <Input id="password" type="password" name="password" required />
        </Field>
        <Field>
          <Button type="submit">ساخت</Button>
        </Field>
        <FieldSeparator>یا ادامه دهید با</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            گیت هاب
          </Button>
          <FieldDescription className="text-center">
            حساب دارید؟ <Link href="?tab=login">ورود</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

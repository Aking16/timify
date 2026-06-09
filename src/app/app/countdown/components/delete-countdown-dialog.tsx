"use client";

import { startTransition, useActionState } from "react";

import { deleteCountdown } from "@/actions/countdowns/delete-countdown";
import { countdowns } from "@/db/schema";
import { Trash } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteCountdownDialog({ id }: typeof countdowns.$inferSelect) {
  const [_state, formAction, isPending] = useActionState(() => deleteCountdown(null!, id), null);

  const handleDelete = () => {
    startTransition(formAction);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full justify-start">
          <HugeiconsIcon icon={Trash} />
          حذف
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>حذف شمارش معکوس</AlertDialogTitle>
          <AlertDialogDescription>
            آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>لغو</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "در حال حذف..." : "تایید"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

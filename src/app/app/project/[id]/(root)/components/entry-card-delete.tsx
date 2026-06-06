import { useActionState } from "react";

import { deleteTimeEntry } from "@/actions/time-entries/delete-time-entry";
import { timeEntries } from "@/db/schema";
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

export default function EntryCardDelete({ id }: typeof timeEntries.$inferSelect) {
  const [_state, formAction, isPending] = useActionState(() => deleteTimeEntry(id), null);

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
          <AlertDialogTitle>حذف تسک</AlertDialogTitle>
          <AlertDialogDescription>
            آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>لغو</AlertDialogCancel>
          <AlertDialogAction onClick={formAction} disabled={isPending}>
            تایید
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

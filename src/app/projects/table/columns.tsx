"use client";

import { projects } from "@/db/schema";
import { CancelIcon, Edit02Icon, TickIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns-jalali";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<typeof projects.$inferSelect>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "نام",
  },
  {
    accessorKey: "description",
    header: "توضیحات",
  },
  {
    accessorKey: "color",
    header: "رنگ",
  },
  {
    accessorKey: "isActive",
    header: "وضعیت",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");

      return isActive ? (
        <div className="flex items-center gap-1 bg-green-500/40 p-1 rounded-lg w-fit px-4">
          <HugeiconsIcon icon={TickIcon} className="text-green-400" />
          <span>فعال</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 bg-destructive/40 p-1 rounded-lg w-fit px-4">
          <HugeiconsIcon icon={CancelIcon} className="text-destructive" />
          <span>غیرفعال</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ ساخت",
    cell: ({ row }) => {
      const createdAtValue = row.getValue("createdAt");

      const date = new Date(createdAtValue as string);

      const formatted = format(date, "PPPP");
      return <p>{formatted}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "عملیات",
    cell: () => {
      return (
        <div>
          <Button size="icon" variant="outline">
            <HugeiconsIcon icon={Edit02Icon} />
          </Button>
        </div>
      );
    },
  },
];

"use client";

import { tags } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns-jalali";

import EditDialog from "../edit-dialog";

export const columns: ColumnDef<typeof tags.$inferSelect>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "نام",
  },
  {
    accessorKey: "color",
    header: "رنگ",
    cell: ({ row }) => {
      const color = row.getValue("color") as string;

      return <div style={{ backgroundColor: color }} className="size-6 rounded-full" />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ ساخت",
    cell: ({ row }) => {
      return <p>TBA</p>;
      const createdAtValue = row.getValue("createdAt");

      const date = new Date(createdAtValue as string);

      const formatted = format(date, "PPPP");
      return <p>{formatted}</p>;
    },
  },
  {
    accessorKey: "actions",
    header: "عملیات",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div>
          <EditDialog key={`edit-tag-dialog-${data.id}`} {...data} />
        </div>
      );
    },
  },
];

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { timeDisplay } from "../../../../lib/time-display";

export default function SavedTimeTable({ times }: { times: number[] }) {
  if (times.length === 0) return null;

  return (
    <Table className="w-[50%] mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead>توقف</TableHead>
          <TableHead>زمان</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {times.map((time, index) => (
          <TableRow key={`saved-time-${index}`}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{timeDisplay(time)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

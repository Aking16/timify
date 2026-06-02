"use client";

import { useState } from "react";

import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import CreateTagDialog from "@/components/shared/create-tag-dialog";
import { Button } from "@/components/ui/button";

export default function CreateTagTrigger() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen((prev) => !prev)}>
        <HugeiconsIcon icon={AddIcon} />
        ساختن برچسب
      </Button>

      <CreateTagDialog isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}

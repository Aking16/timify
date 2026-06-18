"use client";

import { useCallback, useMemo } from "react";

import {
  Heading1Icon,
  Heading2Icon,
  Link01Icon,
  LinkBackwardIcon,
  ParagraphIcon,
  RightToLeftListBulletIcon,
  RightToLeftListNumberIcon,
  TextBoldIcon,
  TextItalicIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Editor } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarProps {
  editor: Editor;
  linkPopoverOpen: boolean;
  onLinkPopoverOpenChange: (open: boolean) => void;
  linkUrl: string;
  onLinkUrlChange: (url: string) => void;
  onLinkSubmit: () => void;
  onUnlink: () => void;
}

export function Toolbar({
  editor,
  linkPopoverOpen,
  onLinkPopoverOpenChange,
  linkUrl,
  onLinkUrlChange,
  onLinkSubmit,
  onUnlink,
}: ToolbarProps) {
  const activeBlockType = useMemo(() => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    return "paragraph";
  }, [editor]);

  const handleBlockTypeChange = useCallback(
    (value: string) => {
      switch (value) {
        case "paragraph":
          editor.chain().focus().setParagraph().run();
          break;
        case "h1":
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          break;
        case "h2":
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          break;
      }
    },
    [editor]
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/50 px-1.5 py-1">
      <Select value={activeBlockType} onValueChange={handleBlockTypeChange}>
        <SelectTrigger className="h-7 w-auto min-w-22.5 border-0 bg-transparent px-2 text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="paragraph">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={ParagraphIcon} />
                پاراگراف
              </span>
            </SelectItem>
            <SelectItem value="h1">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Heading1Icon} />
                عنوان
              </span>
            </SelectItem>
            <SelectItem value="h2">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Heading2Icon} />
                زیرعنوان
              </span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="mx-0.5 my-auto h-5" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              aria-label="Bold"
            >
              <HugeiconsIcon icon={TextBoldIcon} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">پررنگ</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
              aria-label="Italic"
            >
              <HugeiconsIcon icon={TextItalicIcon} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">ایتالیک</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator orientation="vertical" className="mx-0.5 my-auto h-5" />
      {/* Bullet List */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              aria-label="Bullet List"
            >
              <HugeiconsIcon icon={RightToLeftListBulletIcon} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">لیست</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              aria-label="Ordered List"
            >
              <HugeiconsIcon icon={RightToLeftListNumberIcon} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">لیست شماره‌دار</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator orientation="vertical" className="mx-0.5 my-auto h-5" />
      <Popover open={linkPopoverOpen} onOpenChange={onLinkPopoverOpenChange}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 data-[state=active]:bg-muted"
                  aria-label="Link"
                  data-state={editor.isActive("link") ? "active" : undefined}
                >
                  <HugeiconsIcon icon={Link01Icon} />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">لینک</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent align="start" className="w-64 p-3">
          <div className="flex flex-col gap-2">
            <Input
              dir="ltr"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => onLinkUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onLinkSubmit();
                }
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onLinkSubmit}>
                اعمال
              </Button>
              {editor.isActive("link") && (
                <Button size="sm" variant="outline" onClick={onUnlink}>
                  <HugeiconsIcon icon={LinkBackwardIcon} />
                  حذف لینک
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

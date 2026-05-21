import { useRef, useState } from "react";

import { addTagToTimeEntry } from "@/actions/time-entry-tags/add-tag-to-time-entry";
import { removeTagFromTimeEntry } from "@/actions/time-entry-tags/remove-tag-from-time-entry";
import { tags as tagTypes } from "@/db/schema";
import { AddIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import { useClickOutside } from "@/hooks/use-click-outside";

interface TagsChipsProps {
  timeEntryId: string;
  tags: (typeof tagTypes.$inferSelect)[];
  defaultTags?: (typeof tagTypes.$inferSelect)[];
}

export default function TagsChips({ timeEntryId, tags, defaultTags = [] }: TagsChipsProps) {
  const tagIds = tags.map((tag) => tag.id);
  const defaultTagIds = defaultTags.map((tag) => tag.id);

  const [selectedTags, setSelectedTags] = useState(defaultTagIds);
  const [isOpen, setOpen] = useState(false);

  const anchor = useComboboxAnchor();

  const comboboxRef = useRef(null);

  const findTag = (tag: string) => tags.find((item) => item.id === tag);

  function handleTagChange(tags: string[]) {
    setSelectedTags(tags);

    const addedTags = tags.filter((tag) => !selectedTags.includes(tag));
    const removedTags = selectedTags.filter((tag) => !tags.includes(tag));

    // Add new tags
    addedTags.forEach((tag) => {
      addTagToTimeEntry(timeEntryId, tag).catch(
        () => setSelectedTags((prev) => prev.filter((item) => item !== tag)) // remove failed tag
      );
    });

    // Remove tags that were unchecked
    removedTags.forEach((tag) => {
      removeTagFromTimeEntry(timeEntryId, tag).catch(
        () => setSelectedTags((prev) => [...prev, tag]) // re-add if removal fails
      );
    });
  }

  useClickOutside(comboboxRef, () => setOpen(false));

  return (
    <div ref={comboboxRef}>
      <Combobox
        multiple
        autoHighlight
        items={tagIds}
        value={selectedTags}
        onValueChange={handleTagChange}
        open={isOpen}
        onOpenChange={setOpen}
        disabled
      >
        <ComboboxChips ref={anchor} className="p-0 w-full bg-transparent! border-0! ring-0!">
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip
                    key={`combo-value-${value}`}
                    style={{ backgroundColor: findTag(value)?.color ?? "" }}
                    className="h-6 rounded-sm"
                  >
                    {findTag(value)?.name}
                  </ComboboxChip>
                ))}
                <Button
                  variant="outline"
                  size="xs"
                  className="rounded-sm"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <HugeiconsIcon icon={AddIcon} />
                  اضافه کردن
                </Button>
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem
                key={`combo-list-item-${item}`}
                value={item}
                className="my-2"
                style={{ backgroundColor: findTag(item)?.color ?? "" }}
              >
                {findTag(item)?.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

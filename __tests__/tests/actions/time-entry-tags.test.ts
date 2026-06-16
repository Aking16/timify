import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers({ cookie: "mock-cookie" })),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Use vi.hoisted for variables needed in vi.mock factories
const mockSession = vi.hoisted(() => ({
  user: { id: "user-1", name: "Test User", email: "test@example.com" },
  session: { id: "session-1" },
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(mockSession),
    },
  },
}));

const mockDb = vi.hoisted(() => ({
  insert: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: mockDb,
}));

import { addTagToTimeEntry } from "@/actions/time-entry-tags/add-tag-to-time-entry";
import { removeTagFromTimeEntry } from "@/actions/time-entry-tags/remove-tag-from-time-entry";
import { auth } from "@/lib/auth";

describe("Time Entry Tag Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    mockDb.insert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });

    mockDb.delete.mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    });
  });

  describe("addTagToTimeEntry", () => {
    it("adds a tag to a time entry successfully", async () => {
      const result = await addTagToTimeEntry("entry-1", "tag-1");

      expect(result).toEqual({
        success: true,
        message: "برچسب اضافه شد!",
      });
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await addTagToTimeEntry("entry-1", "tag-1");

      expect(result).toEqual({
        message: "آیدی کاربر وارد نشد!",
        success: false,
      });
    });

    it("returns error when timeEntryId is empty", async () => {
      const result = await addTagToTimeEntry("", "tag-1");

      expect(result).toEqual({
        message: "آیدی تسک وارد نشد!",
        success: false,
      });
    });

    it("returns error when tagId is empty", async () => {
      const result = await addTagToTimeEntry("entry-1", "");

      expect(result).toEqual({
        message: "آیدی برچسب وارد نشد!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockRejectedValue(new Error("DB error")),
      });

      const result = await addTagToTimeEntry("entry-1", "tag-1");

      expect(result).toEqual({
        message: "خطایی در تغییر وضعیت برچسب رخ داد!",
        success: false,
      });
    });
  });

  describe("removeTagFromTimeEntry", () => {
    it("removes a tag from a time entry successfully", async () => {
      const result = await removeTagFromTimeEntry("entry-1", "tag-1");

      expect(result).toEqual({
        success: true,
        message: "برچسب اضافه شد!",
      });
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await removeTagFromTimeEntry("entry-1", "tag-1");

      expect(result).toEqual({
        message: "آیدی کاربر وارد نشد!",
        success: false,
      });
    });

    it("returns error when timeEntryId is empty", async () => {
      const result = await removeTagFromTimeEntry("", "tag-1");

      expect(result).toEqual({
        message: "آیدی تسک وارد نشد!",
        success: false,
      });
    });

    it("returns error when tagId is empty", async () => {
      const result = await removeTagFromTimeEntry("entry-1", "");

      expect(result).toEqual({
        message: "آیدی برچسب وارد نشد!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockRejectedValue(new Error("DB error")),
      });

      const result = await removeTagFromTimeEntry("entry-1", "tag-1");

      expect(result).toEqual({
        message: "خطایی در تغییر وضعیت برچسب رخ داد!",
        success: false,
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers({ cookie: "mock-cookie" })),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  cacheTag: vi.fn(),
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
  update: vi.fn(),
  delete: vi.fn(),
  select: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: mockDb,
}));

import { createCountdown } from "@/actions/countdowns/create-countdown";
import { deleteCountdown } from "@/actions/countdowns/delete-countdown";
import { updateCountdown } from "@/actions/countdowns/update-countdown";
import { auth } from "@/lib/auth";

describe("Countdown Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    mockDb.insert.mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    });

    mockDb.update.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });

    mockDb.delete.mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    });

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });
  });

  describe("createCountdown", () => {
    it("creates a countdown successfully", async () => {
      const formData = new FormData();
      formData.append("title", "Focus Session");
      formData.append("duration", "1500");

      const result = await createCountdown(null, formData);

      expect(result).toEqual({
        success: true,
        message: "شمارش معکوس ساخته شد!",
      });
    });

    it("creates a countdown without title (default empty)", async () => {
      const formData = new FormData();
      formData.append("duration", "600");

      const result = await createCountdown(null, formData);

      expect(result?.success).toBe(true);
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Focus");
      formData.append("duration", "1500");

      const result = await createCountdown(null, formData);

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns validation error when duration is 0", async () => {
      const formData = new FormData();
      formData.append("title", "Focus");
      formData.append("duration", "0");

      const result = await createCountdown(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns validation error when duration exceeds max", async () => {
      const formData = new FormData();
      formData.append("title", "Focus");
      formData.append("duration", "86401");

      const result = await createCountdown(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns validation error when title is too long", async () => {
      const formData = new FormData();
      formData.append("title", "a".repeat(65));
      formData.append("duration", "1500");

      const result = await createCountdown(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns error when database throws", async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockRejectedValue(new Error("DB error")),
      });

      const formData = new FormData();
      formData.append("title", "Focus");
      formData.append("duration", "1500");

      const result = await createCountdown(null, formData);

      expect(result).toEqual({
        message: "خطا در ایجاد شمارش معکوس",
        success: false,
      });
    });
  });

  describe("deleteCountdown", () => {
    it("deletes a countdown successfully", async () => {
      const result = await deleteCountdown(null, "countdown-1");

      expect(result).toEqual({
        success: true,
        message: "شمارش معکوس حذف شد!",
      });
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await deleteCountdown(null, "countdown-1");

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns error when id is empty", async () => {
      const result = await deleteCountdown(null, "");

      expect(result).toEqual({
        message: "آیدی الزامی است!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockRejectedValue(new Error("DB error")),
      });

      const result = await deleteCountdown(null, "countdown-1");

      expect(result).toEqual({
        message: "خطا در حذف شمارش معکوس",
        success: false,
      });
    });
  });

  describe("updateCountdown", () => {
    it("updates a countdown title and duration successfully", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: "cd-1", userId: "user-1" }]),
        }),
      });

      const formData = new FormData();
      formData.append("id", "cd-1");
      formData.append("title", "Updated Title");
      formData.append("duration", "2000");

      const result = await updateCountdown(null, formData);

      expect(result).toEqual({
        success: true,
        message: "شمارش معکوس ویرایش شد!",
      });
    });

    it("updates a countdown title only", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: "cd-1", userId: "user-1" }]),
        }),
      });

      const formData = new FormData();
      formData.append("id", "cd-1");
      formData.append("title", "New Title Only");

      const result = await updateCountdown(null, formData);

      expect(result?.success).toBe(true);
    });

    it("returns error when countdown is not found", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const formData = new FormData();
      formData.append("id", "nonexistent");
      formData.append("title", "Updated");

      const result = await updateCountdown(null, formData);

      expect(result).toEqual({
        message: "شمارش معکوس یافت نشد!",
        success: false,
      });
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("id", "cd-1");
      formData.append("title", "Updated");
      formData.append("duration", "1000");

      const result = await updateCountdown(null, formData);

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: "cd-1", userId: "user-1" }]),
        }),
      });

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockRejectedValue(new Error("DB error")),
        }),
      });

      const formData = new FormData();
      formData.append("id", "cd-1");
      formData.append("title", "Updated");
      formData.append("duration", "1000");

      const result = await updateCountdown(null, formData);

      expect(result).toEqual({
        message: "خطا در ویرایش شمارش معکوس",
        success: false,
      });
    });
  });
});

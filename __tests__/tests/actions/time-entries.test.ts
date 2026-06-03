import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers({ cookie: "mock-cookie" })),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
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

// Import after mocks
import { createTimeEntry } from "@/actions/time-entries/create-time-entry";
import { stopTimeEntry } from "@/actions/time-entries/stop-time-entry";
import { editTimeEntry } from "@/actions/time-entries/edit-time-entry";
import { deleteTimeEntry } from "@/actions/time-entries/delete-time-entry";
import { auth } from "@/lib/auth";

describe("Time Entry Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    // Default db chain mocks
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });

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
  });

  describe("createTimeEntry", () => {
    it("creates a time entry successfully", async () => {
      const formData = new FormData();
      formData.append("projectID", "project-1");

      const result = await createTimeEntry(null, formData);

      expect(result).toEqual({
        success: true,
        message: "تسک شروع شد!",
      });
    });

    it("stops running time entries before creating a new one", async () => {
      const runningEntry = {
        id: "entry-1",
        userId: "user-1",
        projectId: "project-1",
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        isRunning: true,
      };
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([runningEntry]),
        }),
      });

      const formData = new FormData();
      formData.append("projectID", "project-2");

      const result = await createTimeEntry(null, formData);

      expect(result?.success).toBe(true);
      // Should have updated the running entry
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("projectID", "project-1");

      const result = await createTimeEntry(null, formData);

      expect(result).toEqual({
        message: "آیدی کاربر وارد نشد!",
        success: false,
      });
    });

    it("returns validation error when projectID is missing", async () => {
      const formData = new FormData();
      // No projectID appended

      const result = await createTimeEntry(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns error when database throws", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockRejectedValue(new Error("DB error")),
        }),
      });

      const formData = new FormData();
      formData.append("projectID", "project-1");

      const result = await createTimeEntry(null, formData);

      expect(result).toEqual({
        message: "خطایی در شروع تسک رخ داد!",
        success: false,
      });
    });
  });

  describe("stopTimeEntry", () => {
    it("stops a running time entry successfully", async () => {
      const runningEntry = {
        id: "entry-1",
        userId: "user-1",
        projectId: "project-1",
        startTime: new Date(Date.now() - 1800000), // 30 minutes ago
        isRunning: true,
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([runningEntry]),
        }),
      });

      const formData = new FormData();
      formData.append("id", "entry-1");

      const result = await stopTimeEntry(null, formData);

      expect(result).toEqual({
        success: true,
        message: "تسک متوقف شد!",
      });
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("id", "entry-1");

      const result = await stopTimeEntry(null, formData);

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns error when entry id is not provided", async () => {
      const formData = new FormData();
      // No id appended

      const result = await stopTimeEntry(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns error when entry is not found", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const formData = new FormData();
      formData.append("id", "nonexistent-entry");

      const result = await stopTimeEntry(null, formData);

      expect(result).toEqual({
        message: "تایم انتری یافت نشد!",
        success: false,
      });
    });

    it("returns error when entry is already stopped", async () => {
      const stoppedEntry = {
        id: "entry-1",
        userId: "user-1",
        projectId: "project-1",
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(),
        isRunning: false,
        duration: 3600,
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([stoppedEntry]),
        }),
      });

      const formData = new FormData();
      formData.append("id", "entry-1");

      const result = await stopTimeEntry(null, formData);

      expect(result).toEqual({
        message: "این تسک قبلاً متوقف شده است!",
        success: false,
      });
    });

    it("returns error when entry has no startTime", async () => {
      const entryNoStart = {
        id: "entry-1",
        userId: "user-1",
        projectId: "project-1",
        startTime: null,
        isRunning: true,
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([entryNoStart]),
        }),
      });

      const formData = new FormData();
      formData.append("id", "entry-1");

      const result = await stopTimeEntry(null, formData);

      expect(result).toEqual({
        message: "این تسک زمان شروع ندارد!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockRejectedValue(new Error("DB error")),
        }),
      });

      const formData = new FormData();
      formData.append("id", "entry-1");

      const result = await stopTimeEntry(null, formData);

      expect(result).toEqual({
        message: "خطایی در توقف تسک رخ داد!",
        success: false,
      });
    });
  });

  describe("editTimeEntry", () => {
    it("edits a time entry successfully", async () => {
      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      });

      const formData = new FormData();
      formData.append("id", "entry-1");
      formData.append("title", "Updated Task Title");
      formData.append("description", "Updated task description here");
      formData.append("startTime", "2025-01-15T09:00:00Z");
      formData.append("endTime", "2025-01-15T10:30:00Z");

      const result = await editTimeEntry(null, formData);

      expect(result).toEqual({
        success: true,
        message: "تسک ویرایش شد!",
      });
    });

    it("edits a time entry without endTime", async () => {
      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(undefined),
        }),
      });

      const formData = new FormData();
      formData.append("id", "entry-1");
      formData.append("title", "Updated Task Title");
      formData.append("description", "Updated task description here");
      formData.append("startTime", "2025-01-15T09:00:00Z");

      const result = await editTimeEntry(null, formData);

      expect(result?.success).toBe(true);
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("id", "entry-1");
      formData.append("title", "Updated Task");
      formData.append("description", "Updated description here");
      formData.append("startTime", "2025-01-15T09:00:00Z");

      const result = await editTimeEntry(null, formData);

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns validation error when title is too short", async () => {
      const formData = new FormData();
      formData.append("id", "entry-1");
      formData.append("title", "Abc"); // Min 4 chars
      formData.append("description", "Valid description here");
      formData.append("startTime", "2025-01-15T09:00:00Z");

      const result = await editTimeEntry(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns validation error when description is too short", async () => {
      const formData = new FormData();
      formData.append("id", "entry-1");
      formData.append("title", "Valid Title");
      formData.append("description", "Abc"); // Min 4 chars
      formData.append("startTime", "2025-01-15T09:00:00Z");

      const result = await editTimeEntry(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns error when database throws", async () => {
      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockRejectedValue(new Error("DB error")),
        }),
      });

      const formData = new FormData();
      formData.append("id", "entry-1");
      formData.append("title", "Updated Task Title");
      formData.append("description", "Updated task description here");
      formData.append("startTime", "2025-01-15T09:00:00Z");

      const result = await editTimeEntry(null, formData);

      expect(result).toEqual({
        message: "خطایی در ویرایش تسک رخ داد!",
        success: false,
      });
    });
  });

  describe("deleteTimeEntry", () => {
    it("deletes a time entry successfully", async () => {
      const result = await deleteTimeEntry("entry-1");

      expect(result).toEqual({
        success: true,
        message: "تسک حذف شد!",
      });
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await deleteTimeEntry("entry-1");

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns error when id is empty", async () => {
      const result = await deleteTimeEntry("");

      expect(result).toEqual({
        message: "آیدی الزامی است!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockRejectedValue(new Error("DB error")),
      });

      const result = await deleteTimeEntry("entry-1");

      expect(result).toEqual({
        message: "خطایی در حذف تسک رخ داد!",
        success: false,
      });
    });
  });
});

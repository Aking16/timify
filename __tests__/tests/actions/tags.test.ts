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
import { createTag } from "@/actions/tags/create-tag";
import { editTag } from "@/actions/tags/edit-tag";
import { deleteTag } from "@/actions/tags/delete-tag";
import { auth } from "@/lib/auth";

describe("Tag Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    // Default db chain mocks
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "tag-1",
            userId: "user-1",
            name: "Test Tag",
            color: "#9ca3af",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      }),
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

  describe("createTag", () => {
    it("creates a tag successfully", async () => {
      const formData = new FormData();
      formData.append("name", "important");
      formData.append("color", "#ff0000");

      const result = await createTag(null, formData);

      expect(result).toEqual({
        success: true,
        tag: expect.objectContaining({
          id: "tag-1",
          name: "Test Tag",
        }),
        message: "برچسب با موفقیت ساخته شد!",
      });
    });

    it("creates a tag without optional color", async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: "tag-2",
              userId: "user-1",
              name: "simple-tag",
              color: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        }),
      });

      const formData = new FormData();
      formData.append("name", "simple-tag");

      const result = await createTag(null, formData);

      expect(result?.success).toBe(true);
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("name", "important");

      const result = await createTag(null, formData);

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns validation error when name is empty", async () => {
      const formData = new FormData();
      formData.append("name", "");

      const result = await createTag(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns validation error when name is too long", async () => {
      const formData = new FormData();
      formData.append("name", "a".repeat(33)); // Max 16 per schema, but error says 32

      const result = await createTag(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns error when database throws", async () => {
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(new Error("DB error")),
        }),
      });

      const formData = new FormData();
      formData.append("name", "important");

      const result = await createTag(null, formData);

      expect(result).toEqual({
        message: "خطایی در ساخت برچسب رخ داد!",
        success: false,
      });
    });
  });

  describe("editTag", () => {
    it("edits a tag successfully", async () => {
      const formData = new FormData();
      formData.append("id", "tag-1");
      formData.append("name", "updated-tag");
      formData.append("color", "#00ff00");

      const result = await editTag(null, formData);

      expect(result).toEqual({
        success: true,
        message: "برچسب ویرایش شد!",
      });
    });

    it("edits a tag without color", async () => {
      const formData = new FormData();
      formData.append("id", "tag-1");
      formData.append("name", "updated-tag");

      const result = await editTag(null, formData);

      expect(result?.success).toBe(true);
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("id", "tag-1");
      formData.append("name", "updated-tag");

      const result = await editTag(null, formData);

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns validation error when name is empty", async () => {
      const formData = new FormData();
      formData.append("id", "tag-1");
      formData.append("name", "");

      const result = await editTag(null, formData);

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
      formData.append("id", "tag-1");
      formData.append("name", "updated-tag");

      const result = await editTag(null, formData);

      expect(result).toEqual({
        message: "خطایی در ویرایش برچسب رخ داد!",
        success: false,
      });
    });
  });

  describe("deleteTag", () => {
    it("deletes a tag successfully", async () => {
      const result = await deleteTag("tag-1");

      expect(result).toEqual({
        success: true,
        message: "برچسب حذف شد!",
      });
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await deleteTag("tag-1");

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns error when id is empty", async () => {
      const result = await deleteTag("");

      expect(result).toEqual({
        message: "آیدی الزامی است!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockRejectedValue(new Error("DB error")),
      });

      const result = await deleteTag("tag-1");

      expect(result).toEqual({
        message: "خطایی در حذف برچسب رخ داد!",
        success: false,
      });
    });
  });
});

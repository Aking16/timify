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
import { createProject } from "@/actions/projects/create-project";
import { editProject } from "@/actions/projects/edit-project";
import { deleteProject } from "@/actions/projects/delete-time-entry";
import { auth } from "@/lib/auth";

describe("Project Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: session exists
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    // Default: db mock chain returns successfully
    mockDb.insert.mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "project-1",
            userId: "user-1",
            name: "Test Project",
            description: null,
            hourlyRate: 0,
            color: "#3b82f6",
            isActive: true,
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

  describe("createProject", () => {
    it("creates a project successfully with valid data", async () => {
      const formData = new FormData();
      formData.append("name", "My New Project");
      formData.append("description", "A test project");
      formData.append("hourlyRate", "50");

      const result = await createProject(null, formData);

      expect(result).toEqual({
        success: true,
        message: "Project created successfully",
        project: expect.objectContaining({
          id: "project-1",
          name: "Test Project",
        }),
      });
    });

    it("creates a project without optional fields", async () => {
      const formData = new FormData();
      formData.append("name", "My New Project");

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: "project-2",
              userId: "user-1",
              name: "My New Project",
              description: null,
              hourlyRate: 0,
              color: "#3b82f6",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        }),
      });

      const result = await createProject(null, formData);
      expect(result?.success).toBe(true);
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("name", "My Project");

      const result = await createProject(null, formData);

      expect(result).toEqual({
        message: "User ID is required",
        success: false,
      });
    });

    it("returns validation error when name is too short", async () => {
      const formData = new FormData();
      formData.append("name", "Abc"); // Min 4 chars

      const result = await createProject(null, formData);

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
      formData.append("name", "My New Project");

      const result = await createProject(null, formData);

      expect(result).toEqual({
        message: "Failed to create project",
        success: false,
      });
    });
  });

  describe("editProject", () => {
    it("edits a project successfully", async () => {
      const formData = new FormData();
      formData.append("id", "project-1");
      formData.append("name", "Updated Project Name");
      formData.append("description", "Updated description");
      formData.append("hourlyRate", "75");
      formData.append("color", "#ff0000");
      formData.append("isActive", "true");

      const result = await editProject(null, formData);

      expect(result).toEqual({
        success: true,
        message: "پروژه ویرایش شد!",
      });
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("id", "project-1");
      formData.append("name", "Updated Project");
      formData.append("isActive", "true");

      const result = await editProject(null, formData);

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns validation error when name is too short", async () => {
      const formData = new FormData();
      formData.append("id", "project-1");
      formData.append("name", "Abc"); // Min 4 chars
      formData.append("isActive", "true");

      const result = await editProject(null, formData);

      expect(result?.success).toBe(false);
      expect(result?.message).toBeDefined();
    });

    it("returns validation error when name is too long", async () => {
      const formData = new FormData();
      formData.append("id", "project-1");
      formData.append("name", "A".repeat(33)); // Max 32 chars
      formData.append("isActive", "true");

      const result = await editProject(null, formData);

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
      formData.append("id", "project-1");
      formData.append("name", "Updated Project Name");
      formData.append("isActive", "true");

      const result = await editProject(null, formData);

      expect(result).toEqual({
        message: "خطایی در ویرایش پروژه رخ داد!",
        success: false,
      });
    });
  });

  describe("deleteProject", () => {
    it("deletes a project successfully", async () => {
      const result = await deleteProject("project-1");

      expect(result).toEqual({
        success: true,
        message: "پروژه حذف شد!",
      });
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it("returns error when user is not authenticated", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await deleteProject("project-1");

      expect(result).toEqual({
        message: "کاربر وارد نشده است!",
        success: false,
      });
    });

    it("returns error when id is empty", async () => {
      const result = await deleteProject("");

      expect(result).toEqual({
        message: "آیدی الزامی است!",
        success: false,
      });
    });

    it("returns error when database throws", async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockRejectedValue(new Error("DB error")),
      });

      const result = await deleteProject("project-1");

      expect(result).toEqual({
        message: "خطایی در حذف پروژه رخ داد!",
        success: false,
      });
    });
  });
});

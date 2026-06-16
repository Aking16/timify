import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers({ cookie: "mock-cookie" })),
}));

const mockDb = vi.hoisted(() => ({
  select: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: mockDb,
}));

import { getReports } from "@/actions/reports/get-daily-hours";

describe("getReports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array when no entries exist", async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });

    const result = await getReports("project-1");
    expect(result).toEqual([]);
  });

  it("groups entries by date and calculates hours", async () => {
    const entries = [
      {
        id: "entry-1",
        projectId: "project-1",
        startTime: new Date("2025-01-15T09:00:00Z"),
        endTime: new Date("2025-01-15T11:00:00Z"), // 2 hours
        isRunning: false,
        duration: 7200,
      },
      {
        id: "entry-2",
        projectId: "project-1",
        startTime: new Date("2025-01-15T14:00:00Z"),
        endTime: new Date("2025-01-15T16:30:00Z"), // 2.5 hours
        isRunning: false,
        duration: 9000,
      },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(entries),
      }),
    });

    const result = await getReports("project-1");
    expect(result).toEqual([
      { date: "2025-01-15", hours: 4.5 },
    ]);
  });

  it("handles entries with no startTime by skipping them", async () => {
    const entries = [
      {
        id: "entry-1",
        projectId: "project-1",
        startTime: null,
        isRunning: false,
        duration: 3600,
      },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(entries),
      }),
    });

    const result = await getReports("project-1");
    expect(result).toEqual([]);
  });

  it("calculates duration from endTime when duration is not set", async () => {
    const entries = [
      {
        id: "entry-1",
        projectId: "project-1",
        startTime: new Date("2025-01-15T09:00:00Z"),
        endTime: new Date("2025-01-15T10:30:00Z"),
        isRunning: false,
        duration: null,
      },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(entries),
      }),
    });

    const result = await getReports("project-1");
    expect(result).toEqual([
      { date: "2025-01-15", hours: 1.5 },
    ]);
  });

  it("groups multiple dates correctly", async () => {
    const entries = [
      {
        id: "entry-1",
        projectId: "project-1",
        startTime: new Date("2025-01-15T09:00:00Z"),
        isRunning: false,
        duration: 3600, // 1 hour
      },
      {
        id: "entry-2",
        projectId: "project-1",
        startTime: new Date("2025-01-16T10:00:00Z"),
        isRunning: false,
        duration: 7200, // 2 hours
      },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(entries),
      }),
    });

    const result = await getReports("project-1");
    expect(result).toEqual([
      { date: "2025-01-15", hours: 1 },
      { date: "2025-01-16", hours: 2 },
    ]);
  });

  it("returns sorted results chronologically", async () => {
    const entries = [
      {
        id: "entry-2",
        projectId: "project-1",
        startTime: new Date("2025-01-16T10:00:00Z"),
        isRunning: false,
        duration: 3600,
      },
      {
        id: "entry-1",
        projectId: "project-1",
        startTime: new Date("2025-01-15T09:00:00Z"),
        isRunning: false,
        duration: 3600,
      },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(entries),
      }),
    });

    const result = await getReports("project-1");
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe("2025-01-15");
    expect(result[1].date).toBe("2025-01-16");
  });

  it("rounds hours to 2 decimal places", async () => {
    const entries = [
      {
        id: "entry-1",
        projectId: "project-1",
        startTime: new Date("2025-01-15T09:00:00Z"),
        isRunning: false,
        duration: 3661, // 1.016944... hours
      },
    ];

    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(entries),
      }),
    });

    const result = await getReports("project-1");
    expect(result).toEqual([
      { date: "2025-01-15", hours: 1.02 },
    ]);
  });

  it("accepts custom date range", async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });

    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-01-31");

    await getReports("project-1", startDate, endDate);

    expect(mockDb.select).toHaveBeenCalled();
  });
});

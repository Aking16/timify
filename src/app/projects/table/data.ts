import { projects } from "@/db/schema";

export async function getData(): Promise<(typeof projects.$inferSelect)[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      userId: "te",
      name: "te",
      color: "ss",
      createdAt: new Date(),
      description: "sdsd",
      isActive: true,
    },
    // ...
  ];
}

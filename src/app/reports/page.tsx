"use client";

import { useEffect } from "react";

import { getActiveProject } from "@/data/get-active-project";
import { useRouter } from "nextjs-toploader/app";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const activeProject = getActiveProject();

    if (!activeProject.id) return;

    router.replace(`/project/${activeProject.id}/reports`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run once on mount

  return <p>در حال بارگذاری...</p>;
}

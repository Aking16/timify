"use client";

import { useEffect } from "react";

import { getActiveProject } from "@/data/get-active-project";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

import PageLoading from "@/components/shared/page-loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const activeProject = getActiveProject();

    if (!activeProject.id) {
      toast.warning("لطفا یک پروژه بسازید!");
      router.replace(`/app/projects`);
      return;
    }

    router.replace(`/app/project/${activeProject.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run once on mount

  return <PageLoading />;
}

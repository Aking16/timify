"use client";

import { useEffect, useState } from "react";

import { getActiveProject } from "@/data/get-active-project";
import { projects } from "@/db/schema";
import {
  CarouselVerticalIcon,
  ChevronsDownUpIcon,
  PlusSignIcon,
  TickIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMount } from "ahooks";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import CreateProjectDialog from "../shared/create-project-dialog";
import { Skeleton } from "../ui/skeleton";

export function ProjectSelector({ data }: { data: (typeof projects.$inferSelect)[] }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<{
    id: string | null;
    name: string | null;
  } | null>(null);
  const [isMounted, setMounted] = useState(false);

  useMount(() => {
    setMounted(true);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveProject(getActiveProject());
  }, []);

  function handleSelectProject(id: string, name: string) {
    localStorage.setItem("active-project", JSON.stringify({ id, name }));
    setActiveProject({ id, name });

    // Check if we're on a project route (matches /project/:id/* pattern)
    const projectRoutePattern = /^\/project\/([^\/]+)(\/.*)?$/;
    const match = pathname.match(projectRoutePattern);

    if (match) {
      // Replace the project ID while keeping the rest of the path
      const restOfPath = match[2] ?? "";
      const newPath = `/project/${id}${restOfPath}`;

      router.push(newPath);
    } else {
      // Fallback to default behavior if not on a project route
      router.push(`/project/${id}`);
    }
  }

  if (!data) return <Skeleton className="h-12 w-full" />;

  // Show a consistent skeleton during SSR and initial hydration
  if (!isMounted) {
    return <Skeleton className="h-12 w-full" />;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={CarouselVerticalIcon} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">پروژه</span>
                  <span className="">{activeProject?.name ?? ""}</span>
                </div>
                <HugeiconsIcon icon={ChevronsDownUpIcon} className="ms-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
              {data
                ?.filter((item) => item.isActive)
                .map((item) => (
                  <DropdownMenuItem
                    key={`projects-selection-${item.id}`}
                    onSelect={() => handleSelectProject(item.id, item.name)}
                  >
                    {item.name}{" "}
                    {item.id === activeProject?.id && (
                      <HugeiconsIcon icon={TickIcon} className="ms-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem key="projects-selection-new" onSelect={() => setOpen(true)}>
                <HugeiconsIcon icon={PlusSignIcon} className="ml-2 h-4 w-4" />
                ساخت پروژه جدید
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateProjectDialog isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}

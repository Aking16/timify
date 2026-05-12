"use client";

import { useActionState, useEffect, useState } from "react";

import { createProject } from "@/actions/projects/create-project";
import { getProjects } from "@/actions/projects/get-projects";
import {
  CarouselVerticalIcon,
  ChevronsDownUpIcon,
  PlusSignIcon,
  TickIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useSWR from "swr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export function ProjectSelector() {
  const { data: projects, isLoading, error, mutate } = useSWR("all-projects", getProjects);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(createProject, null);

  useEffect(() => {
    if (state?.success && state.project) {
      // Refresh the projects list
      mutate();
      // Auto-select the new project
      setSelectedProject({ id: state.project.id, name: state.project.name });
      // Close modal
      setIsModalOpen(false);
    }
  }, [state, mutate]);

  if (error) return <p>خطا در دریافت پروژه</p>;
  if (isLoading) return <Skeleton className="h-12 w-full" />;

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
                  <span className="font-medium">Documentation</span>
                  <span className="">{selectedProject?.name}</span>
                </div>
                <HugeiconsIcon icon={ChevronsDownUpIcon} className="ms-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
              {projects?.map((item) => (
                <DropdownMenuItem
                  key={`projects-selection-${item.id}`}
                  onSelect={() => setSelectedProject({ id: item.id, name: item.name })}
                >
                  {item.name}{" "}
                  {item.id === selectedProject?.id && (
                    <HugeiconsIcon icon={TickIcon} className="ms-auto" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem key="projects-selection-new" onSelect={() => setIsModalOpen(true)}>
                <HugeiconsIcon icon={PlusSignIcon} className="ml-2 h-4 w-4" />
                Create New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ساخت پروژه جدید</DialogTitle>
            <DialogDescription>پروژه جدید برای مدیریت تسک هات بساز</DialogDescription>
          </DialogHeader>

          <form id="new-project-form" className="space-y-4 py-4" action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">نام پروژه</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="نام پروژه خود را وارد کنید"
                  autoFocus
                  required
                  minLength={4}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">توضیحات (اختیاری)</FieldLabel>
                <Input
                  id="description"
                  name="description"
                  placeholder="توضیحات پروژه خود را وارد کنید"
                />
              </Field>
            </FieldGroup>
          </form>

          {state?.message && !state.success && (
            <p className="text-sm  bg-destructive rounded-sm p-2">{state.message}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="new-project-form" disabled={isPending}>
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

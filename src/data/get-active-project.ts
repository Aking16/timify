export function getActiveProject(): { id: string | null; name: string | null } {
  if (typeof window === "undefined") return { id: null, name: null };

  const activeProjectJSON = window.localStorage.getItem("active-project");
  const activeProject = activeProjectJSON && JSON.parse(activeProjectJSON);

  if (!activeProject) return { id: null, name: null };

  return activeProject;
}

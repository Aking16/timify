export function getActiveProject(): { id: string | null; name: string | null } {
  const activeProjectJSON = localStorage.getItem("active-project");
  const activeProject = activeProjectJSON && JSON.parse(activeProjectJSON);

  if (!activeProject) return { id: null, name: null };

  return activeProject;
}

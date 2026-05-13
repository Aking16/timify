export function getActiveProject(): { id: string; name: string } {
  const activeProjectJSON = localStorage.getItem("active-project");
  const activeProject = activeProjectJSON && JSON.parse(activeProjectJSON);

  if (!activeProject) return { id: "", name: "" };

  return activeProject;
}

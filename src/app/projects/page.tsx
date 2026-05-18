import { getProjects } from "@/actions/projects/get-projects";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./components/table/columns";
import { DataTable } from "./components/table/data-table";

export default async function Page() {
  const projects = await getProjects();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>همه پروژه ها</CardTitle>
          <CardDescription>لیست تمامی پروژه ها</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={projects} />
        </CardContent>
      </Card>
    </div>
  );
}

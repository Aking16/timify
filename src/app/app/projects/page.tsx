import { getProjects } from "@/actions/projects/get-projects";

import { DataTable } from "@/components/layout/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./components/table/columns";

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

import { getTags } from "@/actions/tags/get-tags";

import { DataTable } from "@/components/layout/data-table";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CreateTagDialog from "./components/create-tag-dialog";
import { columns } from "./components/table/columns";

export default async function Page() {
  const projects = await getTags();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>همه پروژه ها</CardTitle>
          <CardDescription>لیست تمامی پروژه ها</CardDescription>
          <CardAction>
            <CreateTagDialog />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={projects} />
        </CardContent>
      </Card>
    </div>
  );
}

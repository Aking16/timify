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

import CreateTagTrigger from "./components/create-tag-trigger";
import { columns } from "./components/table/columns";

export default async function Page() {
  const projects = await getTags();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>همه برچسب ها</CardTitle>
          <CardDescription>لیست تمامی برچسب ها</CardDescription>
          <CardAction>
            <CreateTagTrigger />
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={projects} />
        </CardContent>
      </Card>
    </div>
  );
}

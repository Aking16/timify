import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>همه پروژه ها</CardTitle>
        <CardDescription>لیست تمامی پروژه ها</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64" />
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CountdownCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-[50%] h-6" />
        </CardTitle>
        <CardDescription className="sr-only">Card Description Skeleton</CardDescription>
        <CardAction>
          <Skeleton className="size-8" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Skeleton className="size-62 rounded-full mx-auto" />
      </CardContent>
      <CardFooter className="flex justify-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="size-12 rounded-full" />
      </CardFooter>
    </Card>
  );
}

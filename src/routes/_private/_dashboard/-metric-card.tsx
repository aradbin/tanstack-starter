import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnyType } from "@/lib/types";

export default function MetricCard({
  title,
  description,
  icon,
}: {
  title: AnyType;
  description: AnyType;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold">{description}</CardTitle>
        <CardAction>{icon}</CardAction>
      </CardHeader>
    </Card>
  )
}
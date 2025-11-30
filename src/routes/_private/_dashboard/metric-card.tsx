import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
      <CardHeader className="flex justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {description}
        </div>
      </CardContent>
    </Card>
  )
}
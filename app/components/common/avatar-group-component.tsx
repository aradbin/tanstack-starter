import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptionType } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AvatarComponent from "@/components/common/avatar-component";

export default function AvatarGroupComponent({
  users
}: {
  users: OptionType[]
}) {
  return (
    <div className="flex items-center -space-x-2 *:ring-3 *:ring-background">
      {users.slice(0, 4).map((user, index) => (
        <Tooltip key={index}>
          <TooltipTrigger>
            <AvatarComponent user={user} />
          </TooltipTrigger>
          <TooltipContent>
            <AvatarComponent user={user} options={{ hideBody: true }} />
          </TooltipContent>
        </Tooltip>
      ))}
      {users.length > 4 && (
        <Avatar className="border-2 border-background z-5 text-sm font-medium text-muted-foreground">
          <AvatarFallback>
            +{users.length - 4}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

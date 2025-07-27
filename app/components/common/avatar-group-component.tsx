import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OptionType } from "@/lib/types";
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
            <AvatarComponent user={user} options={{ hideBody: true }} />
          </TooltipTrigger>
          <TooltipContent>
            <AvatarComponent user={user} />
          </TooltipContent>
        </Tooltip>
      ))}
      {users.length > 4 && (
        <AvatarComponent user={{
          id: "",
          name: `+ ${users.length - 4}`
        }} options={{ hideBody: true }} classNames="z-5 text-sm font-medium text-muted-foreground" />
      )}
    </div>
  );
}

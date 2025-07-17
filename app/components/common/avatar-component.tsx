import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptionType } from "@/lib/types";
import { getInitials } from "@/lib/utils";

export default function AvatarComponent({ user }: { user: OptionType }) {
  return (
    <div className="flex gap-2">
      <Avatar>
        <AvatarImage src={user?.image || ""} alt={user?.name} />
        <AvatarFallback className="bg-transparent">
          {getInitials(user?.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-left overflow-hidden">
        <p className="text-sm font-medium truncate">{user?.name}</p>
        <p className="text-xs text-muted-foreground font-semibold truncate">{user?.email}</p>
      </div>
    </div>
  )
}

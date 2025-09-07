import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptionType } from "@/lib/types";
import { getInitials } from "@/lib/utils";

export default function AvatarComponent({ user, classNames, options }: {
  user: OptionType,
  classNames?: string
  options?: {
    hideBody?: boolean
    hideDescription?: boolean
    avatarFallbackClassNames?: string
  }
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={`border-1 border-background hover:z-10 ${classNames}`}>
        <AvatarImage src={user?.image || ""} alt={user?.name} />
        <AvatarFallback className={options?.avatarFallbackClassNames}>
          {getInitials(user?.name)}
        </AvatarFallback>
      </Avatar>
      {!options?.hideBody && (
        <div className="flex flex-col text-left overflow-hidden">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          {!options?.hideDescription && user?.email && (
            <p className="text-xs text-muted-foreground font-semibold truncate">{user?.email}</p>
          )}
        </div>
      )}
    </div>
  )
}

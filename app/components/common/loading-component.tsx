import { Loader2 } from "lucide-react";

export default function LoadingComponent({
  isLoading
}: {
  isLoading: boolean | null | undefined
}) {
  if(!isLoading){
    return null
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex gap-2 items-center justify-center rounded-lg bg-black/30 backdrop-blur-sm">
      <Loader2 className="animate-spin" />
    </div>
  )
}
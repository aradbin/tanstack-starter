import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { assets } from "@/lib/db/schema"
import { AnyType } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { useApp } from "@/providers/app-provider"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, BoomBox, Calendar, Drill, Edit, Truck } from "lucide-react"

export default function AssetCard({
  asset
}: {
  asset: typeof assets.$inferSelect & {
    metadata: AnyType
  }
}) {
  const { setAssetModal } = useApp()

  return (
    <Card className="relative w-full">
      <Link to="/assets" className="absolute top-4 left-4">
        <Button variant="outline" size="icon"><ArrowLeft /></Button>
      </Link>
      <CardHeader className="text-center">
        <div className="border-1 border-background bg-muted rounded-full size-16 flex justify-center items-center mx-auto">
          <Truck className="size-10 mx-auto" />
        </div>
        <p className="text-2xl font-bold">{asset?.metadata?.registrationNumber}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">Trips</div>
          </div>
          <div>
            <div className="text-2xl font-bold">56</div>
            <div className="text-xs text-muted-foreground">Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold">892</div>
            <div className="text-xs text-muted-foreground">Invoices</div>
          </div>
        </div> */}
        <div className='flex flex-col gap-2 text-sm text-muted-foreground'>
          <div className="flex items-center">
            <Calendar className="size-4 mr-2" />{formatDate(asset?.metadata?.registrationDate)}
          </div>
          <div className="flex items-center">
            <Drill className="size-4 mr-2" />{asset?.metadata?.fitnessExpiryDate ? formatDate(asset?.metadata?.fitnessExpiryDate) : 'N/A'}
          </div>
          <div className="flex items-center">
            <BoomBox className="size-4 mr-2" />{asset?.metadata?.taxTokenExpiryDate ? formatDate(asset?.metadata?.taxTokenExpiryDate) : 'N/A'}
          </div>
          <div className="flex items-center">
            <BoomBox className="size-4 mr-2" />{asset?.metadata?.roadPermitExpiryDate ? formatDate(asset?.metadata?.roadPermitExpiryDate) : 'N/A'}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button className="flex-1" onClick={() => {
            setAssetModal({
              id: asset?.id,
              isOpen: true
            })
          }}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
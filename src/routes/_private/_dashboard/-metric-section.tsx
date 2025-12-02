import { Loader2, Truck, Users } from "lucide-react";
import MetricCard from "./-metric-card";
import { useQuery } from "@tanstack/react-query";
import { getDatas } from "@/lib/db/functions";
import { Link } from "@tanstack/react-router";

export default function MetricSection() {
  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await getDatas({
        data: {
          table: 'employees',
          relation: {
            designation: true
          }
        }
      })

      return {
        drivers: response?.result?.filter((emp: any) => emp?.designation?.name?.toLowerCase() === 'driver') || [],
        helpers: response?.result?.filter((emp: any) => emp?.designation?.name?.toLowerCase() === 'helper') || [],
        staffs: response?.result?.filter((emp: any) => emp?.designation?.name?.toLowerCase() === 'office staff') || [],
      }
    }
  })

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => getDatas({
      data: {
        table: 'assets'
      }
    })
  })

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Link to="/employees" search={{ designation: employees?.drivers?.[0]?.designation?.id }}>
        <MetricCard
          title="Drivers"
          description={employeesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : employees?.drivers?.length ?? ""}
          icon={<Users className="size-5" />}
        />
      </Link>

      <Link to="/employees" search={{ designation: employees?.helpers?.[0]?.designation?.id }}>
        <MetricCard
          title="Helpers"
          description={employeesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : employees?.helpers?.length ?? ""}
          icon={<Users className="size-5" />}
        />
      </Link>

      <Link to="/employees" search={{ designation: employees?.staffs?.[0]?.designation?.id }}>
        <MetricCard
          title="Office Staffs"
          description={employeesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : employees?.staffs?.length ?? ""}
          icon={<Users className="size-5" />}
        />
      </Link>

      <Link to="/assets">
        <MetricCard
          title="Vehicles"
          description={assetsLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : assets?.count ?? ""}
          icon={<Truck className="size-5" />}
        />
      </Link>
    </div>
  )
}
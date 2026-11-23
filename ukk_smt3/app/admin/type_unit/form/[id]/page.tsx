import { Suspense } from "react"
import { TypeUnitForm } from "@/app/admin/type_unit/form/type_unit-form"

type EditTypeUnitPageProps = {
  params: Promise<{ id: string }>
}

async function EditTypeUnitLoader({ params }: EditTypeUnitPageProps) {
  const { id } = await params
  return <TypeUnitForm unitId={id} />
}

export default function EditTypeUnitPage({ params }: EditTypeUnitPageProps) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Memuat form...</div>}>
      <EditTypeUnitLoader params={params} />
    </Suspense>
  )
}
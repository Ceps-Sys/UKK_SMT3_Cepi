import { Suspense } from "react"
import { FasilitasForm } from "@/app/admin/fasilitas/form/facility-form"

type EditFasilitasPageProps = {
  params: Promise<{ id: string }>
}

async function EditFasilitasLoader({ params }: EditFasilitasPageProps) {
  const { id } = await params
  return <FasilitasForm facilityId={id} />
}

export default function EditFasilitasPage({ params }: EditFasilitasPageProps) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Memuat form...</div>}>
      <EditFasilitasLoader params={params} />
    </Suspense>
  )
}
'use client'

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type FacilityData = {
  kode_facility: string
  nama_facility: string
}

type FasilitasFormProps = {
  facilityId?: string
}

export function FasilitasForm({ facilityId }: FasilitasFormProps) {
  const router = useRouter()
  const [facility, setFacility] = useState<FacilityData | null>(null)
  const [namaFacility, setNamaFacility] = useState("")
  const [isLoading, setIsLoading] = useState(Boolean(facilityId))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!facilityId) return

    let isActive = true
    async function loadFacility() {
      try {
        const response = await fetch(`/api/fasilitas/${facilityId}`)
        const result = await response.json()
        if (!response.ok) throw new Error(result.error ?? "Gagal memuat facility.")

        if (isActive) {
          setFacility(result.facility)
          setNamaFacility(result.facility.nama_facility)
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat facility.")
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadFacility()
    return () => {
      isActive = false
    }
  }, [facilityId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const response = await fetch(
        facilityId ? `/api/fasilitas/${facilityId}` : "/api/fasilitas",
        {
          method: facilityId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama_facility: namaFacility.trim(),
          }),
        }
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Gagal menyimpan facility.")
      router.push("/admin/fasilitas")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan facility.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="m-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          {facilityId ? "Edit facility" : "Tambah facility"}
        </h1>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/fasilitas")}>
          <ArrowLeft aria-hidden="true" />
          Kembali
        </Button>
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <p className="mt-5 text-sm text-muted-foreground">Memuat facility...</p>
      ) : facilityId && !facility ? null : (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 rounded-md border p-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label htmlFor="kode_facility" className="text-sm font-medium">
              Kode Facility
            </label>
            <Input
              id="kode_facility"
              value={facility ? facility.kode_facility : "Otomatis (FCTxxx)"}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="nama_facility" className="text-sm font-medium">
              Nama Facility
            </label>
            <Input
              id="nama_facility"
              value={namaFacility}
              onChange={(event) => setNamaFacility(event.target.value)}
              placeholder="Contoh: Swimming Pool / Gym"
              required
              maxLength={50}
            />
          </div>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/fasilitas")}
              disabled={isSaving}
            >
              <X aria-hidden="true" />
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : facility ? "Simpan perubahan" : "Buat facility"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type FacilityItem = {
  kode_facility: string
  nama_facility: string
  created_at?: string
  updated_at?: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  totalFacilities: number
  totalPages: number
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "-"
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function FasilitasPage() {
  const router = useRouter()
  const [facilities, setFacilities] = useState<FacilityItem[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    totalFacilities: 0,
    totalPages: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function loadFacilities(targetPage = 1) {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/fasilitas?page=${targetPage}&pageSize=10`)
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error ?? "Gagal memuat data facility.")
      }
      setFacilities(result.facilities ?? [])
      if (result.pagination) {
        setPagination(result.pagination)
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat data facility.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadFacilities(1)
  }, [])

  async function handleDelete(kodeFacility: string) {
    if (!confirm(`Yakin ingin menghapus facility ${kodeFacility}?`)) return

    setDeletingCode(kodeFacility)
    setError("")
    try {
      const response = await fetch(`/api/fasilitas/${kodeFacility}`, {
        method: "DELETE",
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error ?? "Gagal menghapus facility.")
      }
      await loadFacilities(pagination.page)
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus facility.")
    } finally {
      setDeletingCode(null)
    }
  }

  return (
    <Card className="m-6 p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Facility Management</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data fasilitas apartemen.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/fasilitas/form/add")}>
          <Plus aria-hidden="true" />
          Tambah facility
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No</TableHead>
              <TableHead className="w-40">Kode Facility</TableHead>
              <TableHead>Nama Facility</TableHead>
              <TableHead className="w-36">Dibuat</TableHead>
              <TableHead className="w-36">Diperbarui</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Memuat data facility...
                </TableCell>
              </TableRow>
            ) : facilities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Belum ada data facility.
                </TableCell>
              </TableRow>
            ) : (
              facilities.map((item, index) => (
                <TableRow key={item.kode_facility}>
                  <TableCell>
                    {(pagination.page - 1) * pagination.pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{item.kode_facility}</TableCell>
                  <TableCell>{item.nama_facility}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell>{formatDate(item.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/fasilitas/form/${item.kode_facility}`)
                        }
                        title="Edit facility"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={deletingCode === item.kode_facility}
                        onClick={() => handleDelete(item.kode_facility)}
                        title="Hapus facility"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Halaman {pagination.page} dari {pagination.totalPages} ({pagination.totalFacilities} facility)
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pagination.page <= 1 || isLoading}
            onClick={() => loadFacilities(pagination.page - 1)}
          >
            &lt; Previous
          </Button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              type="button"
              variant={pageNum === pagination.page ? "outline" : "ghost"}
              size="sm"
              disabled={isLoading}
              onClick={() => loadFacilities(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || isLoading}
            onClick={() => loadFacilities(pagination.page + 1)}
          >
            Next &gt;
          </Button>
        </div>
      </div>
    </Card>
  )
}
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Category = {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
  created_at?: string
  updated_at?: string
}

type Pagination = {
  page: number
  pageSize: number
  totalCategories: number
  totalPages: number
}

function formatDate(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalCategories: 0,
    totalPages: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchCategories = useCallback(async (page: number, pageSize: number) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/categories?page=${page}&pageSize=${pageSize}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal memuat data kategori.")
      }

      setCategories(Array.isArray(data.categories) ? data.categories : [])
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (error) {
      setCategories([])
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan saat memuat kategori."
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories(pagination.page, pagination.pageSize)
  }, [fetchCategories, pagination.page, pagination.pageSize])

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Hapus kategori "${category.name}"?`)
    if (!confirmed) return

    setDeletingId(category.id)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus kategori.")
      }

      await fetchCategories(pagination.page, pagination.pageSize)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menghapus kategori."
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Kelola daftar kategori konten perusahaan.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/categories/form/add">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Link>
        </Button>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead className="w-36">Dibuat</TableHead>
              <TableHead className="w-36">Diperbarui</TableHead>
              <TableHead className="w-44 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Memuat kategori...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Belum ada kategori.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {(pagination.page - 1) * pagination.pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {formatDate(category.createdAt ?? category.created_at)}
                  </TableCell>
                  <TableCell>
                    {formatDate(category.updatedAt ?? category.updated_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/categories/form/${category.id}`}>
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === category.id}
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        {deletingId === category.id ? "Menghapus..." : "Hapus"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Halaman {pagination.page} dari {pagination.totalPages} (Total:{" "}
          {pagination.totalCategories} kategori)
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1 || isLoading}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || isLoading}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
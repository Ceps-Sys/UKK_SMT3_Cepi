"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CategoryFormProps = {
  initialData?: {
    id: number
    name: string
  }
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData?.id)

  const [name, setName] = useState(initialData?.name ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setErrorMessage("Nama kategori wajib diisi.")
      return
    }

    setIsSubmitting(true)

    try {
      const endpoint = isEdit
        ? `/api/categories/${initialData!.id}`
        : "/api/categories"
      const method = isEdit ? "PATCH" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan kategori.")
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit Categories" : "Tambah Categories"}
          </h1>

          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border p-6">
          {errorMessage && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama kategori"
              maxLength={191}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" asChild disabled={isSubmitting}>
              <Link href="/admin/categories">
                <X className="mr-1.5 h-4 w-4" />
                Batal
              </Link>
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Buat categories"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
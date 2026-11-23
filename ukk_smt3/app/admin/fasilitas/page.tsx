
'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type ManagedFacility = {
    kode_facility: string
    nama_facility: string
    created_at: string
    updated_at: string
}

const PAGE_SIZE = 10

export default function FacilityManagementPage() {
    const router = useRouter()

    const [facilities, setFacilities] = useState<ManagedFacility[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalFacilities, setTotalFacilities] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const totalPages = Math.max(
        1,
        Math.ceil(totalFacilities / PAGE_SIZE)
    )

    async function loadFacilities(page = currentPage) {
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch(
                `/api/fasilitas?page=${page}&pageSize=${PAGE_SIZE}`
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.error ?? "Gagal memuat facility."
                )
            }

            setFacilities(result.facilities)
            setTotalFacilities(result.pagination.totalFacilities)
            setCurrentPage(result.pagination.page)
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Gagal memuat facility."
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        let isActive = true

        async function initialLoad() {
            try {
                const response = await fetch(
                    `/api/fasilitas/?page=1&pageSize=${PAGE_SIZE}`
                )

                const result = await response.json()

                if (!response.ok) {
                    throw new Error(
                        result.error ?? "Gagal memuat facility."
                    )
                }

                if (isActive) {
                    setFacilities(result.facilities)
                    setTotalFacilities(
                        result.pagination.totalFacilities
                    )
                    setCurrentPage(result.pagination.page)
                }
            } catch (loadError) {
                if (isActive) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Gagal memuat facility."
                    )
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        void initialLoad()

        return () => {
            isActive = false
        }
    }, [])

    function goToPage(page: number) {
        if (page < 1 || page > totalPages || isLoading) return

        void loadFacilities(page)
    }

    async function deleteFacility(facility: ManagedFacility) {
        const confirmed = window.confirm(
            `Hapus facility ${facility.nama_facility} (${facility.kode_facility})?`
        )

        if (!confirmed) return

        setError("")

        try {
            const response = await fetch(
                `/api/facilities/${facility.kode_facility}`,
                {
                    method: "DELETE",
                }
            )

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.error ?? "Gagal menghapus facility."
                )
            }

            if (facilities.length === 1 && currentPage > 1) {
                await loadFacilities(currentPage - 1)
            } else {
                await loadFacilities(currentPage)
            }
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : "Gagal menghapus facility."
            )
        }
    }

    return (
        <Card className="m-6 px-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="mb-1 text-2xl font-bold">
                        Facility Management
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Kelola data fasilitas apartemen.
                    </p>
                </div>

                <Button
                    onClick={() =>
                        router.push("/admin/fasilitas/form/add")
                    }
                >
                    <Plus aria-hidden="true" />
                    Tambah facility
                </Button>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mt-4 text-sm text-destructive"
                >
                    {error}
                </p>
            )}

            <div className="mt-5 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Kode Facility</TableHead>
                            <TableHead>Nama Facility</TableHead>
                            <TableHead>Dibuat</TableHead>
                            <TableHead>Diperbarui</TableHead>
                            <TableHead className="text-right">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center"
                                >
                                    Memuat facility...
                                </TableCell>
                            </TableRow>
                        ) : facilities.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center"
                                >
                                    Belum ada facility.
                                </TableCell>
                            </TableRow>
                        ) : (
                            facilities.map((facility, index) => (
                                <TableRow
                                    key={facility.kode_facility}
                                >
                                    <TableCell>
                                        {(currentPage - 1) *
                                            PAGE_SIZE +
                                            index +
                                            1}
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {facility.kode_facility}
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {facility.nama_facility}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(
                                            facility.created_at
                                        ).toLocaleDateString("id-ID")}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(
                                            facility.updated_at
                                        ).toLocaleDateString("id-ID")}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Edit ${facility.nama_facility}`}
                                                title="Edit facility"
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/fasilitas/form/${facility.kode_facility}`
                                                    )
                                                }
                                            >
                                                <Pencil aria-hidden="true" />
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Hapus ${facility.nama_facility}`}
                                                title="Hapus facility"
                                                onClick={() =>
                                                    void deleteFacility(
                                                        facility
                                                    )
                                                }
                                            >
                                                <Trash2 aria-hidden="true" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages} (
                    {totalFacilities} facility)
                </p>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                aria-disabled={
                                    currentPage === 1 || isLoading
                                }
                                className={
                                    currentPage === 1 || isLoading
                                        ? "pointer-events-none opacity-50"
                                        : undefined
                                }
                                onClick={(e) => {
                                    e.preventDefault()
                                    goToPage(currentPage - 1)
                                }}
                            />
                        </PaginationItem>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        goToPage(page)
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                aria-disabled={
                                    currentPage === totalPages ||
                                    isLoading
                                }
                                className={
                                    currentPage === totalPages ||
                                    isLoading
                                        ? "pointer-events-none opacity-50"
                                        : undefined
                                }
                                onClick={(e) => {
                                    e.preventDefault()
                                    goToPage(currentPage + 1)
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </Card>
    )
}

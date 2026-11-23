
import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/src/prisma/db"

const facilityTable = db.orm.facility

export async function GET(request: Request) {
    if (!(await getAuthenticatedUser())) {
        return NextResponse.json(
            { error: "Silakan login untuk melanjutkan." },
            { status: 401 }
        )
    }

    const searchParams = new URL(request.url).searchParams

    const requestedPage = Number.parseInt(
        searchParams.get("page") ?? "1",
        10
    )

    const requestedPageSize = Number.parseInt(
        searchParams.get("pageSize") ?? "10",
        10
    )

    const pageSize = Number.isFinite(requestedPageSize)
        ? Math.min(100, Math.max(1, requestedPageSize))
        : 10

    try {
        const allFacilities: any[] = await facilityTable.all()

        allFacilities.sort((a, b) =>
            String(a.kode_facility).localeCompare(
                String(b.kode_facility)
            )
        )

        const totalFacilities = allFacilities.length

        const totalPages = Math.max(
            1,
            Math.ceil(totalFacilities / pageSize)
        )

        const page =
            Number.isFinite(requestedPage) && requestedPage > 0
                ? Math.min(requestedPage, totalPages)
                : 1

        const start = (page - 1) * pageSize

        const facilities = allFacilities.slice(
            start,
            start + pageSize
        )

        return NextResponse.json({
            facilities,
            pagination: {
                page,
                pageSize,
                totalFacilities,
                totalPages,
            },
        })
    } catch (error) {
        console.error("Failed to fetch facilities:", error)

        return NextResponse.json(
            { error: "Gagal memuat data facility." },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    if (!(await getAuthenticatedUser())) {
        return NextResponse.json(
            { error: "Silakan login untuk melanjutkan." },
            { status: 401 }
        )
    }

    let body: Record<string, unknown>

    try {
        body = await request.json()
    } catch {
        return NextResponse.json(
            { error: "Format request tidak valid." },
            { status: 400 }
        )
    }

    const kode_facility =
        typeof body.kode_facility === "string"
            ? body.kode_facility.trim().toUpperCase()
            : ""

    const nama_facility =
        typeof body.nama_facility === "string"
            ? body.nama_facility.trim()
            : ""

    if (
        !/^[A-Z0-9]{1,6}$/.test(kode_facility) ||
        !nama_facility ||
        nama_facility.length > 50
    ) {
        return NextResponse.json(
            { error: "Kode atau nama facility tidak valid." },
            { status: 400 }
        )
    }

    try {
        const existing = await facilityTable
            .where({ kode_facility })
            .first()

        if (existing) {
            return NextResponse.json(
                { error: "Kode facility sudah digunakan." },
                { status: 409 }
            )
        }

        const now = new Date()

        const created = await facilityTable.create({
            kode_facility,
            nama_facility,
            created_at: now,
            updated_at: now,
        })

        return NextResponse.json(
            { facility: created },
            { status: 201 }
        )
    } catch (error) {
        console.error("Failed to create facility:", error)

        return NextResponse.json(
            { error: "Gagal menambahkan facility." },
            { status: 500 }
        )
    }
}


import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/src/prisma/db"

const facilityTable = db.orm.facility

type RouteContext = {
    params: Promise<{
        kode_facility: string
    }>
}

async function getFacilityCode(context: RouteContext) {
    const params = await context.params
    return params.kode_facility.trim().toUpperCase()
}

export async function GET(
    _request: Request,
    context: RouteContext
) {
    if (!(await getAuthenticatedUser())) {
        return NextResponse.json(
            { error: "Silakan login untuk melanjutkan." },
            { status: 401 }
        )
    }

    try {
        const kode_facility = await getFacilityCode(context)

        const facility = await facilityTable
            .where({ kode_facility })
            .first()

        if (!facility) {
            return NextResponse.json(
                { error: "Facility tidak ditemukan." },
                { status: 404 }
            )
        }

        return NextResponse.json({ facility })
    } catch (error) {
        console.error("Failed to fetch facility:", error)

        return NextResponse.json(
            { error: "Gagal mengambil data facility." },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    context: RouteContext
) {
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

    const nama_facility =
        typeof body.nama_facility === "string"
            ? body.nama_facility.trim()
            : ""

    if (!nama_facility || nama_facility.length > 50) {
        return NextResponse.json(
            { error: "Nama facility wajib diisi (maksimal 50 karakter)." },
            { status: 400 }
        )
    }

    try {
        const kode_facility = await getFacilityCode(context)

        const existing = await facilityTable
            .where({ kode_facility })
            .first()

        if (!existing) {
            return NextResponse.json(
                { error: "Facility tidak ditemukan." },
                { status: 404 }
            )
        }

        const updated = await facilityTable
            .where({ kode_facility })
            .update({
                nama_facility,
                updated_at: new Date(),
            })

        return NextResponse.json({
            message: "Facility berhasil diperbarui.",
            facility: updated ?? {
                ...existing,
                nama_facility,
                updated_at: new Date(),
            },
        })
    } catch (error) {
        console.error("Failed to update facility:", error)

        return NextResponse.json(
            { error: "Gagal memperbarui facility." },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _request: Request,
    context: RouteContext
) {
    if (!(await getAuthenticatedUser())) {
        return NextResponse.json(
            { error: "Silakan login untuk melanjutkan." },
            { status: 401 }
        )
    }

    try {
        const kode_facility = await getFacilityCode(context)

        const existing = await facilityTable
            .where({ kode_facility })
            .first()

        if (!existing) {
            return NextResponse.json(
                { error: "Facility tidak ditemukan." },
                { status: 404 }
            )
        }

        await facilityTable
            .where({ kode_facility })
            .delete()

        return NextResponse.json({
            message: "Facility berhasil dihapus.",
        })
    } catch (error) {
        console.error("Failed to delete facility:", error)

        return NextResponse.json(
            {
                error:
                    "Gagal menghapus facility. Pastikan facility tidak sedang digunakan oleh type unit.",
            },
            { status: 500 }
        )
    }
}

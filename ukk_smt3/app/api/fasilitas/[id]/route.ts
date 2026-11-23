import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/src/prisma/db"

const facilityTable = db.orm.facility

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

async function getFacilityCode(context: RouteContext) {
  const params = await context.params
  return decodeURIComponent(params.id).trim().toUpperCase()
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
    const allFacilities: any[] = await facilityTable.all()
    const facility = allFacilities.find(
      (item) => String(item.kode_facility).trim().toUpperCase() === kode_facility
    )

    if (!facility) {
      return NextResponse.json(
        { error: `Facility ${kode_facility} tidak ditemukan.` },
        { status: 404 }
      )
    }

    return NextResponse.json({ facility })
  } catch (error) {
    console.error("Failed to fetch facility:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengambil data facility." },
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
    typeof body.nama_facility === "string" ? body.nama_facility.trim() : ""

  if (!nama_facility || nama_facility.length > 50) {
    return NextResponse.json(
      { error: "Nama facility wajib diisi (maksimal 50 karakter)." },
      { status: 400 }
    )
  }

  try {
    const kode_facility = await getFacilityCode(context)
    const allFacilities: any[] = await facilityTable.all()
    const existing = allFacilities.find(
      (item) => String(item.kode_facility).trim().toUpperCase() === kode_facility
    )

    if (!existing) {
      return NextResponse.json(
        { error: "Facility tidak ditemukan." },
        { status: 404 }
      )
    }

    const updated = await facilityTable
      .where({ kode_facility: existing.kode_facility })
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
      { error: error instanceof Error ? error.message : "Gagal memperbarui facility." },
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
    const allFacilities: any[] = await facilityTable.all()
    const existing = allFacilities.find(
      (item) => String(item.kode_facility).trim().toUpperCase() === kode_facility
    )

    if (!existing) {
      return NextResponse.json(
        { error: "Facility tidak ditemukan." },
        { status: 404 }
      )
    }

    await facilityTable
      .where({ kode_facility: existing.kode_facility })
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
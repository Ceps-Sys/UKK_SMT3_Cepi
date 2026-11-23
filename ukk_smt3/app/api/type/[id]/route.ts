import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/src/prisma/db"

const typeUnitTable = db.orm.type_unit
const facilityTable = db.orm.facility
const pivotTable = db.orm.type_unit_facility

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, context: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const unitId = Number(id)

    const [allUnits, allFacilities, allPivots]: [any[], any[], any[]] = await Promise.all([
      typeUnitTable.all(),
      facilityTable.all(),
      pivotTable.all(),
    ])

    const unit = allUnits.find((u) => Number(u.id_unit_type) === unitId)
    if (!unit) {
      return NextResponse.json({ error: "Type unit tidak ditemukan." }, { status: 404 })
    }

    allFacilities.sort((a, b) =>
      String(a.kode_facility).localeCompare(String(b.kode_facility))
    )

    const selectedCodes = allPivots
      .filter((p) => Number(p.id_unit_type) === unitId)
      .map((p) => String(p.kode_facility))

    return NextResponse.json({
      unit,
      facilities: allFacilities,
      selectedCodes,
    })
  } catch (error) {
    console.error("GET /api/type/[id] error:", error)
    return NextResponse.json({ error: "Gagal memuat detail type unit." }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const unitId = Number(id)
    const body = await req.json()
    const kodeFacilities: string[] = Array.isArray(body.kode_facilities)
      ? body.kode_facilities
      : []

    await pivotTable.where({ id_unit_type: unitId }).delete()

    for (const kode of kodeFacilities) {
      await pivotTable.create({
        id_unit_type: unitId,
        kode_facility: String(kode),
      })
    }

    return NextResponse.json({ message: "Fasilitas unit berhasil diperbarui." })
  } catch (error) {
    console.error("PUT /api/type/[id] error:", error)
    return NextResponse.json({ error: "Gagal menyimpan fasilitas unit." }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const unitId = Number(id)

    await pivotTable.where({ id_unit_type: unitId }).delete()
    await typeUnitTable.where({ id_unit_type: unitId }).delete()

    return NextResponse.json({ message: "Type unit berhasil dihapus." })
  } catch (error) {
    console.error("DELETE /api/type/[id] error:", error)
    return NextResponse.json(
      { error: "Gagal menghapus type unit. Pastikan tidak sedang dipakai oleh data kamar." },
      { status: 500 }
    )
  }
}
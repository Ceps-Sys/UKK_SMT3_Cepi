import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/src/prisma/db"

const typeUnitTable = db.orm.type_unit
const pivotTable = db.orm.type_unit_facility

export async function GET() {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  try {
    const [allUnits, allPivots]: [any[], any[]] = await Promise.all([
      typeUnitTable.all(),
      pivotTable.all(),
    ])

    allUnits.sort((a, b) => Number(a.id_unit_type) - Number(b.id_unit_type))

    const result = allUnits.map((unit) => {
      const total_facilities = allPivots.filter(
        (p) => Number(p.id_unit_type) === Number(unit.id_unit_type)
      ).length

      return {
        ...unit,
        total_facilities,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("GET /api/type error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memuat data type unit." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  try {
    const body = await req.json()
    const nama_type_unit =
      typeof body.nama_type_unit === "string" ? body.nama_type_unit.trim() : ""
    const branch_id = String(body.branch_id ?? "1")

    if (!nama_type_unit) {
      return NextResponse.json(
        { error: "Nama type unit wajib diisi." },
        { status: 400 }
      )
    }

    const created = await typeUnitTable.create({
      nama_type_unit,
      branch_id,
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("POST /api/type error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menambahkan type unit." },
      { status: 500 }
    )
  }
}
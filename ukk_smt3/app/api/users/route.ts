import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/src/prisma/db"
import { createUserJwt, hashUserPassword } from "@/lib/user-security"

const usersTable = db.orm.users

function isDuplicateEmail(error: unknown) {
  if (typeof error !== "object" || error === null) return false
  const err = error as Record<string, unknown>
  return err.code === "P2002" || err.code === "ER_DUP_ENTRY" || err.errno === 1062
}

export async function GET(request: Request) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  const searchParams = new URL(request.url).searchParams
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10)
  const requestedPageSize = Number.parseInt(searchParams.get("pageSize") ?? "10", 10)
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.min(100, Math.max(1, requestedPageSize))
    : 10

  try {
    const allUsers: any[] = await usersTable.all()
    allUsers.sort((a, b) => Number(b.id) - Number(a.id))

    const totalUsers = allUsers.length
    const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))
    const page = Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1

    const start = (page - 1) * pageSize
    const users = allUsers.slice(start, start + pageSize)

    return NextResponse.json({
      users: users.map(({ token, password: _password, created_at, updated_at, ...user }) => ({
        ...user,
        createdAt: created_at,
        updatedAt: updated_at,
        hasToken: Boolean(token),
      })),
      pagination: { page, pageSize, totalUsers, totalPages },
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Gagal memuat data user." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Format request tidak valid." }, { status: 400 })
  }

  const fullname = typeof body.fullname === "string" ? body.fullname.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body.password === "string" ? body.password : ""
  const role = typeof body.role === "string" ? body.role : "staff"

  if (!fullname || fullname.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 191) {
    return NextResponse.json({ error: "Nama atau email tidak valid." }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 })
  }
  if (role !== "admin" && role !== "staff") {
    return NextResponse.json({ error: "Role tidak valid." }, { status: 400 })
  }
  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: "JWT_SECRET belum diatur." }, { status: 500 })
  }

  try {
    const existing = await usersTable.where({ email }).first()
    if (existing) {
      return NextResponse.json({ error: "Email sudah digunakan." }, { status: 409 })
    }

    // Tentukan prefix berdasarkan role
    const prefix = role === "admin" ? "ADM" : "STF"

    const allUsers: any[] = await usersTable.all()
    let maxNumber = 0
    for (const u of allUsers) {
      if (typeof u.kode_user === "string" && u.kode_user.startsWith(prefix)) {
        const num = Number.parseInt(u.kode_user.slice(prefix.length), 10)
        if (!Number.isNaN(num) && num > maxNumber) {
          maxNumber = num
        }
      }
    }
    const kode_user = `${prefix}${String(maxNumber + 1).padStart(3, "0")}`

    const passwordHash = await hashUserPassword(password)
    const created = await usersTable.create({
      kode_user,
      fullname,
      email,
      password: passwordHash,
      role,
    })

    const token = createUserJwt(created)
    const updated = await usersTable.where({ id: created.id }).update({
      token,
    })

    const finalUser = updated ?? { ...created, token }
    const { token: savedToken, password: _password, created_at, updated_at, ...safeUser } = finalUser

    return NextResponse.json(
      {
        user: {
          ...safeUser,
          createdAt: created_at,
          updatedAt: updated_at,
          hasToken: Boolean(savedToken),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return NextResponse.json({ error: "Email sudah digunakan." }, { status: 409 })
    }
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: "Gagal membuat user. Periksa koneksi database." }, { status: 500 })
  }
}
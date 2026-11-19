import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/src/prisma/db"
import { hashUserPassword } from "@/lib/user-security"

const usersTable = db.orm.users

type RouteContext = { params: Promise<{ id: string }> }

function isDuplicateEmail(error: unknown) {
  if (typeof error !== "object" || error === null) return false
  const err = error as Record<string, unknown>
  return err.code === "P2002" || err.code === "ER_DUP_ENTRY" || err.errno === 1062
}

async function getUserId(context: RouteContext) {
  const { id } = await context.params
  const userId = Number(id)
  return Number.isInteger(userId) && userId > 0 ? userId : null
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  const userId = await getUserId(context)
  if (!userId) return NextResponse.json({ error: "ID user tidak valid." }, { status: 400 })

  try {
    const user = await usersTable.where({ id: userId }).first()
    if (!user) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 })

    const { token, password: _password, created_at, updated_at, ...safeUser } = user
    return NextResponse.json({
      user: {
        ...safeUser,
        createdAt: created_at,
        updatedAt: updated_at,
        hasToken: Boolean(token),
      },
    })
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json({ error: "Gagal memuat data user." }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json(
      { error: "Silakan login untuk melanjutkan." },
      { status: 401 }
    )
  }

  const userId = await getUserId(context)
  if (!userId) {
    return NextResponse.json({ error: "ID user tidak valid." }, { status: 400 })
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

  const fullname = typeof body.fullname === "string" ? body.fullname.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const role = typeof body.role === "string" ? body.role : ""
  const password = typeof body.password === "string" ? body.password : ""

  if (!fullname || fullname.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 191) {
    return NextResponse.json({ error: "Nama atau email tidak valid." }, { status: 400 })
  }

  if (role !== "admin" && role !== "staff") {
    return NextResponse.json({ error: "Role tidak valid." }, { status: 400 })
  }

  if (password && password.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 })
  }

  try {
    const existing = await usersTable.where({ id: userId }).first()
    if (!existing) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      )
    }

    const emailOwner = await usersTable.where({ email }).first()
    if (emailOwner && Number(emailOwner.id) !== userId) {
      return NextResponse.json(
        { error: "Email sudah digunakan." },
        { status: 409 }
      )
    }

    const passwordHash = password
      ? await hashUserPassword(password)
      : undefined

    const updated = await usersTable.where({ id: userId }).update({
      fullname,
      email,
      role,
      ...(passwordHash ? { password: passwordHash } : {}),
    })

    const finalUser = updated ?? { ...existing, fullname, email, role }
    const { token, password: _password, created_at, updated_at, ...safeUser } = finalUser

    return NextResponse.json({
      user: {
        ...safeUser,
        createdAt: created_at,
        updatedAt: updated_at,
        hasToken: Boolean(token),
      },
    })
  } catch (error) {
    if (isDuplicateEmail(error)) {
      return NextResponse.json(
        { error: "Email sudah digunakan." },
        { status: 409 }
      )
    }

    console.error("Failed to update user:", error)

    return NextResponse.json(
      { error: "Gagal memperbarui user. Periksa koneksi database." },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await getAuthenticatedUser())) {
    return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 })
  }

  const userId = await getUserId(context)
  if (!userId) return NextResponse.json({ error: "ID user tidak valid." }, { status: 400 })

  try {
    const existing = await usersTable.where({ id: userId }).first()
    if (!existing) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 })
    }

    await usersTable.where({ id: userId }).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json({ error: "Gagal menghapus user." }, { status: 500 })
  }
}
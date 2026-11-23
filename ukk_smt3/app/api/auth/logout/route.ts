import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/src/prisma/db"
import { verifyUserJwt } from "@/lib/user-security"

const usersTable = db.orm.users

export async function POST() {
  const token = (await cookies()).get("auth_token")?.value
  if (token) {
    const payload = verifyUserJwt(token)
    const userId = payload ? Number(payload.sub) : NaN

    if (Number.isSafeInteger(userId) && userId > 0) {
      try {
        const user = await usersTable.where({ id: userId }).first()
        if (user && user.token === token) {
          await usersTable.where({ id: userId }).update({
            token: null,
          })
        }
      } catch (error) {
        console.error("Failed to revoke login token:", error)
      }
    }
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  })
  return response
}
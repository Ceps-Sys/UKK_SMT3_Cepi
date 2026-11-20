  // // SEMENTARA: Bypass login untuk testing CRUD
  // export async function getAuthenticatedUser() {
  //   return {
  //     id: 1,
  //     fullname: "Administrator",
  //     email: "admin@example.com",
  //     role: "admin",
  //   }
  // }

  // /* --- KODE PATOKAN ASLI (Uncomment setelah selesai tes CRUD) ---
  // import { cookies } from "next/headers"
  // import { db } from "@/src/prisma/db"
  // import { verifyUserJwt } from "@/lib/user-security"

  // export async function getAuthenticatedUser() {
  //   const token = (await cookies()).get("auth_token")?.value
  //   if (!token) return null

  //   const payload = verifyUserJwt(token)
  //   if (!payload) return null

  //   const userId = Number(payload.sub)
  //   if (!Number.isSafeInteger(userId) || userId < 1) return null

  //   const user = await (db.orm as any).app.users
  //     .where({ id: userId })
  //     .first()
  //   if (!user || user.token !== token) return null

  //   const { token: _token, password: _password, ...authenticatedUser } = user
  //   return authenticatedUser
  // }
  // */

  import { cookies } from "next/headers"
import { db } from "@/src/prisma/db"
import { verifyUserJwt } from "@/lib/user-security"

export async function getAuthenticatedUser() {
  const token = (await cookies()).get("auth_token")?.value
  if (!token) return null

  const payload = verifyUserJwt(token)
  if (!payload) return null

  const userId = Number(payload.sub)
  if (!Number.isSafeInteger(userId) || userId < 1) return null

  // Menggunakan db.orm.users sesuai dengan api/auth/login/route.ts
  const user = await db.orm.users
    .where({ id: userId })
    .first()
  if (!user || user.token !== token) return null

  const { token: _token, password: _password, ...authenticatedUser } = user
  return authenticatedUser
}
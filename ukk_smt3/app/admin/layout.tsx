// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/sidebar/sidebar"
// import { SidebarInset } from "@/components/ui/sidebar"
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { LogoutMenuItem } from "./logout-menu-item" // 1. Import komponen yang sudah ada

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4">
//           <SidebarTrigger />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <Avatar>
//                   <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuGroup>
//                 <DropdownMenuItem>Profile</DropdownMenuItem>
//                 <DropdownMenuItem>Billing</DropdownMenuItem>
//                 <DropdownMenuItem>Settings</DropdownMenuItem>
//               </DropdownMenuGroup>
//               <DropdownMenuSeparator />
//               <DropdownMenuGroup>
//                 {/* 2. Ganti DropdownMenuItem lama dengan LogoutMenuItem */}
//                 <LogoutMenuItem />
//               </DropdownMenuGroup>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </header>
//         {children}
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutMenuItem } from "./logout-menu-item"

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Cek apakah user sudah login & tokennya valid
  const user = await getAuthenticatedUser()
  if (!user) {
    redirect("/") // Otomatis lempar ke halaman utama/login jika belum login
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between border-b px-4">
          <SidebarTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt={user.fullname} />
                  <AvatarFallback>{user.fullname.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <LogoutMenuItem />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
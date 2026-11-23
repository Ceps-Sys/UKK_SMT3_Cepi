  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroupAction,
    SidebarMenuButton,

  } from "@/components/ui/sidebar"
  import { getIconComponent } from "@/lib/icon-map"
  import Image from "next/image";

  const listmenu = [
    {
      "name": "dasboard",
      "url": "/admin",
      "icon": "dasboard",
    },
    {
      "name": "user management",
      "url": "/admin/user-management",
      "icon": "users",
    },
    {
      "name": "Type Unit",
      "url": "/admin/type_unit",
      "icon": "settings",
    },
    {
      "name": "Facilities",
      "url": "/admin/fasilitas",
      "icon": "settings",
    }
  ]
  
  export function AppSidebar() {
    return (
      <Sidebar className="bg-red-800 text-zinc-100 border-r border-zinc-800/80">

        <SidebarHeader className="p-4 bg-red-800 border-b border-red-800/50">
          <div className="relative w-[200px] h-[50px] rounded-[70px] items-center justify-start">
            <Image className="p-[7px]" src="/img/smk_mvp_ars_logo_white.png" alt="logo" fill />
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-red-800 px-2 pt-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-2">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                {listmenu.map((menu) => {
                  const IconComponent = getIconComponent(menu.icon)
                  return (
                    <SidebarMenuItem key={menu.name}>
                      <SidebarMenuButton
                        asChild
                        className="w-full text-zinc-400 hover:text-white hover:bg-red-600/70 active:bg-red-800 transition-all duration-150 rounded-lg px-3 py-2.5 my-0.5"
                      >
                        <a href={menu.url} className="flex items-center gap-3">
                          {IconComponent && <IconComponent className="w-4 h-4" />}
                          <span className="text-sm font-medium">{menu.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 bg-zinc-950 border-t border-zinc-800/50" />
      </Sidebar>
    )
  }
'use client'

import { ChevronRight, Sparkles } from 'lucide-react'
import { useLocation, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSidebar } from '@/components/ui'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  IconWrapper,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui'
import { sidebarRoutes } from '@/router/routes'
import { ISidebarRoute } from '@/types'
import { Logo } from '@/assets/images'

export default function AppSidebar() {
  const { t } = useTranslation('sidebar')
  const location = useLocation()
  const { state, toggleSidebar } = useSidebar()
  const isActive = (path: string) => location.pathname === path

  const translatedSidebarRoute = (sidebarRoutes: ISidebarRoute) => ({
    ...sidebarRoutes,
    title: t(`${sidebarRoutes.title}`),
    children: sidebarRoutes.children?.map((child) => ({
      ...child,
      title: t(`${child.title}`),
    })),
  })

  // Translate all sidebar routes
  const translatedRoutes = sidebarRoutes.map(translatedSidebarRoute)

  return (
    <Sidebar
      variant="inset"
      className="z-50 bg-white border-r"
      collapsible="icon"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <SidebarMenuButton size="lg" asChild>
              <NavLink
                to="/staff/home"
                className="flex items-center justify-center w-full"
              >
                {/* <div className="flex items-center justify-center text-white rounded-lg aspect-square size-8 bg-primary shrink-0 group-data-[collapsible=icon]:w-full">
                  <Command className="size-4" />
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-primary">SMART</span>
                  <span>COFFEE</span>
                </div> */}
                <img src={Logo} alt="logo" className="h-6" />
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {translatedRoutes.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={isActive(item.path) ? 'text-primary' : ''}
                  >
                    <NavLink
                      to={item.path}
                      onClick={(e) => {
                        if (state === 'collapsed') {
                          e.preventDefault()
                          toggleSidebar()
                        }
                      }}
                    >
                      {item.icon && (
                        <IconWrapper
                          Icon={item.icon}
                          className={isActive(item.path) ? 'text-primary' : ''}
                        />
                      )}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                  {item.children?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={
                                  isActive(subItem.path) ? 'text-primary' : ''
                                }
                              >
                                <NavLink
                                  to={subItem.path}
                                  className="flex flex-col gap-4"
                                >
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild></DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

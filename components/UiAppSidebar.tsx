"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks } from "lucide-react";

import { UiNavUser } from "@/components/UiNavUser";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useNavItems, type NavItem } from "@/hooks/useNavItems";

export function UiAppSidebar() {
  const pathname = usePathname();
  const navItems = useNavItems();

  const renderItem = (item: NavItem) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;
    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton isActive={active} tooltip={item.label} render={<Link href={item.href} />}>
          <Icon className="size-4" />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-1.5 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            TaskFlow
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{navItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UiNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

function Logo() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500 text-white">
      <ListChecks className="size-5" strokeWidth={2.2} />
    </span>
  );
}

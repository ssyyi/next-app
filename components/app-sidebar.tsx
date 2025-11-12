"use client";

import * as React from "react";
import { Command, Gauge, MessagesSquare } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import avatar from "@/public/avatar.jpg";
import logo from "@/public/logo.png";
const data = {
  user: {
    name: "相故如初",
    email: "atme@outlook.at",
    avatar: avatar.src,
  },
  projects: [
    {
      name: "Dashboard",
      url: "/",
      icon: Gauge,
    },
    {
      name: "Dialogue",
      url: "/dialogue",
      icon: MessagesSquare,
    },
  ],
  icon: {
    name: "MCP TOOL",
    logo: logo,
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset"   {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Avatar className="h-10 w-10 rounded-lg bg-amber-50">
                    <AvatarImage
                      src={data.icon.logo.src}
                      alt={data.icon.name}
                    />
                    <AvatarFallback className="rounded-lg">SSY</AvatarFallback>
                  </Avatar>
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold">MCP TOOL Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

import { Home, Palette } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Canvas",
        url: "/canvas",
        icon: Palette,
    },
];

export function AppSidebar() {
    const location = useLocation();

    return (
        <ShadcnSidebar className="border-r border-white/10 bg-[#0d0d12]">
            <SidebarContent className="bg-[#0d0d12] text-white">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-white/60">Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        className="text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-white transition-colors"
                                    >
                                        <Link to={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </ShadcnSidebar>
    );
}

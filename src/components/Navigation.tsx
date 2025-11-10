import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navigation(): React.JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sidebar collapsible="offcanvas" variant="sidebar">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={location.pathname.startsWith(
                                        "/project/add"
                                    )}
                                    onClick={() => navigate("/project/add")}
                                >
                                    <UserPlus /> Create
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    onClick={() => navigate("/project")}
                                    isActive={location.pathname === "/project"}
                                >
                                    <User /> View all
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

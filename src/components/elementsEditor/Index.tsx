import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
    SidebarTrigger,
} from "../ui/sidebar";

export default function Elements(): React.JSX.Element {
    return (
        <section>
            <SidebarProvider defaultOpen={true}>
                <SidebarTrigger className="z-10" />
                <Sidebar
                    variant="sidebar"
                    collapsible="offcanvas"
                    className="relative z-0"
                >
                    <SidebarContent>
                        <section>Elements</section>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>
        </section>
    );
}

import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
    SidebarTrigger,
} from "../ui/sidebar";

export default function Elements(): React.JSX.Element {
    return (
        <section>
            <SidebarProvider defaultOpen={true} className="flex flex-col">
                <div className="flex items-center gap-1">
                    <SidebarTrigger className="z-10" />
                    <h4>Elements</h4>
                </div>
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

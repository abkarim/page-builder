import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
    SidebarTrigger,
} from "../ui/sidebar";

export default function ElementStylesEditor(): React.JSX.Element {
    return (
        <section>
            <SidebarProvider defaultOpen={true}>
                <SidebarTrigger className="z-10" />
                <Sidebar
                    variant="sidebar"
                    collapsible="offcanvas"
                    className="relative z-0"
                    side="right"
                >
                    <SidebarContent>
                        <section>Styles Editor</section>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>
        </section>
    );
}

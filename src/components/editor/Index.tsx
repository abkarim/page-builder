import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
    SidebarTrigger,
} from "../ui/sidebar";

export default function ElementStylesEditor(): React.JSX.Element {
    return (
        <section>
            <SidebarProvider
                defaultOpen={true}
                className="flex flex-col items-end"
            >
                <div className="flex items-center gap-1">
                    <h4>Editor</h4>
                    <SidebarTrigger className="z-10" />
                </div>
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

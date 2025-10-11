import { PlusIcon } from "lucide-react";

export default function (): React.JSX.Element {
    return (
        <section>
            <div className="space-y-2">
                <button className="flex flex-col gap-2 justify-center items-center p-2 rounded-sm text-[var(--color-primary-foreground)] bg-[var(--foreground)]">
                    <PlusIcon size={52} />
                    <p>Create new project</p>
                </button>
            </div>
        </section>
    );
}

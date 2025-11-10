import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@radix-ui/react-context-menu";
import { useState } from "react";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export default function (): React.JSX.Element {
    const [name, setName] = useState("");
    const [directory, setDirectory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function selectDirectory() {
        try {
            /**
             * Select folder path
             */
            const selectedFolder = await open({
                multiple: false,
                directory: true,
            });

            setDirectory(selectedFolder);
        } catch (e) {
            console.error(e);
            toast.error("something went wrong");
        }
    }

    async function create() {
        if (name.trim().length === 0) {
            return toast.error("Name can't be empty");
        }

        setIsLoading(true);

        try {
            const message = await invoke<string>("create_project", {
                name,
                directory,
            });

            toast.success(message);
        } catch (err) {
            toast.error(err as string);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section>
            <fieldset>
                <Label>Select Project Directory</Label>
                <div className="flex items-center justify-start gap-2">
                    <Button onClick={selectDirectory} variant="secondary">
                        {directory === null ? "Select" : "Change"} directory
                    </Button>
                    {directory !== null && <p>{directory}</p>}
                </div>
            </fieldset>
            <fieldset>
                <Label>Project name</Label>
                <Input
                    type="text"
                    placeholder="project name"
                    className="w-full"
                    value={name}
                    onInput={(e) => setName(e.currentTarget.value)}
                />
            </fieldset>
            <div className="mt-3">
                <Button disabled={isLoading} onClick={create}>
                    {isLoading && <Spinner />} Create
                </Button>
            </div>
        </section>
    );
}

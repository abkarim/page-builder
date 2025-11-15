import { ConfirmDialogContext } from "@/context/ConfirmDialogContext";
import { useContext } from "react";

export default function useConfirmDialog() {
    const context = useContext(ConfirmDialogContext);

    if (context === null) {
        throw new Error("useConfirmDialog muse be used within a provider");
    }

    const { setOpen, setTitle, setDescription, setResolver } = context;

    async function getConfirmation({
        title,
        description,
    }: {
        title?: string;
        description?: string;
    }): Promise<boolean> {
        setTitle(title ? title : "Are you absolutely sure?");
        setDescription(
            description ? description : "This action cannot be undone."
        );
        setOpen(true);

        return new Promise((resolve) => setResolver(() => resolve));
    }

    return getConfirmation;
}

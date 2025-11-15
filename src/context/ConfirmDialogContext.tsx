import { createContext, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogContextType = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setResolver: React.Dispatch<
        React.SetStateAction<((v: boolean) => void) | null>
    >;
};

export const ConfirmDialogContext =
    createContext<ConfirmDialogContextType | null>(null);

export function ConfirmDialogContextProvider({
    children,
}: {
    children: React.JSX.Element;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
        null
    );

    function handleClose(result: boolean) {
        setOpen(false);
        if (resolver) resolver(result);
        setResolver(null);
    }

    return (
        <ConfirmDialogContext.Provider
            value={{ setResolver, setOpen, setTitle, setDescription }}
        >
            {children}
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleClose(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleClose(true)}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmDialogContext.Provider>
    );
}

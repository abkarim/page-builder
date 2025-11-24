import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Editor() {
    const { id, name } = useParams();

    async function getContent() {
        if (!id || !name) {
            return toast.error("invalid project file");
        }
    }

    useEffect(() => {
        getContent();
    }, []);

    return (
        <section>
            Editor {id} {name}
        </section>
    );
}

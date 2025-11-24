import { Route, Routes } from "react-router-dom";
import Create from "./Create";
import List from "./List";
import View from "./View";
import Editor from "./Editor";

export default function (): React.JSX.Element {
    return (
        <Routes>
            <Route index element={<List />} />
            <Route path="/:id" element={<View />} />
            <Route path="/:id/:name" element={<Editor />} />
            <Route path="add" element={<Create />} />
        </Routes>
    );
}

import { Route, Routes } from "react-router-dom";
import Create from "./Create";
import List from "./List";
import View from "./View";

export default function (): React.JSX.Element {
    return (
        <Routes>
            <Route index element={<List />} />
            <Route path="/:id" element={<View />} />
            <Route path="add" element={<Create />} />
        </Routes>
    );
}

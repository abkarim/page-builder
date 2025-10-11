import { Route, Routes } from "react-router";
import Create from "./Create";
import List from "./List";
import View from "./View";

export default function (): React.JSX.Element {
    return (
        <Routes>
            <Route index element={<List />} />
            <Route path="add" element={<Create />} />
            <Route path="view" element={<View />} />
        </Routes>
    );
}

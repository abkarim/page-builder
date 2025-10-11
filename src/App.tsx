import { Route, Routes } from "react-router";
import "./App.css";
import Index from "./screens/Index";
import ProjectIndex from "./screens/project/Index";

function App(): React.JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<Index />}>
                <Route path="project/*" element={<ProjectIndex />} />
                <Route path="*" element={<p>Not found</p>} />
            </Route>
        </Routes>
    );
}

export default App;

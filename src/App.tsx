import { Route, Routes } from "react-router";
import "./App.css";
import Index from "./screens/Index";

function App(): React.JSX.Element {
    return (
        <main className="px-1">
            <Routes>
                <Route path="/" element={<Index />} />
            </Routes>
        </main>
    );
}

export default App;

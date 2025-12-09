import App from "@/App";
import { createBrowserRouter } from "react-router-dom";
import Index from "./Index";
import ProjectIndex from "./project/Index";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Index /> },
            { path: "project/*", element: <ProjectIndex /> },
            { path: "*", element: <p>Not found</p> },
        ],
    },
]);

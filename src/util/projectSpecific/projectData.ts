import { invoke } from "@tauri-apps/api/core";
import { ProjectData } from "src-tauri/bindings/ProjectData";

let data: ProjectData | null = null;

export async function getProjectDataConfiguration(
    name?: string,
): Promise<ProjectData> {
    if (data === null || (name !== undefined && data.name !== name)) {
        data = await invoke<ProjectData>("get_project_configuration");
    }

    return data;
}

export async function setProjectDataConfiguration(
    projectData: ProjectData,
): Promise<string> {
    const response = await invoke<string>(
        "update_current_project_configuration",
        {
            config: projectData.configuration,
        },
    );

    data = projectData;

    return response;
}

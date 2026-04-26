import { invoke } from "@tauri-apps/api/core";
import { ProjectAsset } from "src-tauri/bindings/ProjectAsset";
import { ProjectAssetType } from "src-tauri/bindings/ProjectAssetType";
import { ProjectData } from "src-tauri/bindings/ProjectData";

let data: ProjectData | null = null;
let projectAssets: ProjectAsset[] | null = null;

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

export async function getProjectAssets(
    file_type?: ProjectAssetType,
    ignore_cache?: true,
) {
    if (projectAssets === null || ignore_cache === true) {
        projectAssets = await invoke<ProjectAsset[]>("get_project_assets");
    }

    let data = projectAssets;

    if (file_type !== undefined) {
        let filteredData = Object.groupBy(
            projectAssets,
            ({ file_type }) => file_type,
        );
        data = filteredData[file_type] || [];
    }

    return data;
}

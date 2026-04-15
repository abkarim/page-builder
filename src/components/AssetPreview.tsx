import { toProjectUrl } from "@/util/projectSpecific/url";
import { ProjectAsset } from "src-tauri/bindings/ProjectAsset";

interface Props {
    asset: ProjectAsset;
}

export default function AssetPreview({ asset }: Props): React.JSX.Element {
    const { file_type, filepath, filename } = asset;

    return (
        <div>
            {file_type === "Image" && <img src={toProjectUrl(filepath)} />}
            {file_type === "Video" && <video src={toProjectUrl(filepath)} />}
            <p>{filename}</p>
        </div>
    );
}

import { toProjectUrl } from "@/util/projectSpecific/url";
import { BracesIcon, FileIcon } from "lucide-react";
import { ProjectAsset } from "src-tauri/bindings/ProjectAsset";

interface Props {
    asset: ProjectAsset;
}

export default function AssetPreview({ asset }: Props): React.JSX.Element {
    const { file_type, filepath, filename } = asset;

    return (
        <div className="flex flex-col justify-between h-full gap-2 bg-gray-200 p-2 rounded-sm">
            <div>
                {file_type === "CSS" && <FileIcon size={50} />}
                {file_type === "JS" && <BracesIcon size={50} />}
                {file_type === "Image" && <img src={toProjectUrl(filepath)} />}
                {file_type === "Video" && (
                    <video
                        controls
                        preload="none"
                        poster={toProjectUrl(filepath)}
                        playsInline
                        autoPlay={false}
                    >
                        This is not supported
                    </video>
                )}
            </div>
            <p>{filename}</p>
        </div>
    );
}

interface ArchiveProps {
    data: ProjectAsset[];
    onClick: (asset: ProjectAsset) => void;
}

export function AssetsPreviewArchive({
    data,
    onClick,
}: ArchiveProps): React.JSX.Element {
    return (
        <section className="px-2 space-y-2">
            <p>Total {data.length.toString()}</p>
            <div className="grid grid-flow-col gap-2">
                {data.map((asset) => (
                    <div
                        className="cursor-pointer"
                        onClick={() => onClick(asset)}
                        key={asset.filepath}
                    >
                        <AssetPreview asset={asset} />
                    </div>
                ))}
            </div>
        </section>
    );
}

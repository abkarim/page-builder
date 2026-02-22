import { isElementEditorAvailableForComponent } from "@/util/EditorAndComponentConnection";
import HTMLContent, { type HTMLContentData } from "./HTMLContent";
import ButtonEditor, { type ButtonData } from "./Button";
import TagEditor, { type TagData } from "./Tag";
import ClassNameEditor, { type ClassNameData } from "./ClassName";
import ContentEditor, { type ContentData } from "./Content";
import AssetEditor, { type AssetData } from "./Asset";

export interface ElementEditorProps {
    component: string;
    data: {
        tagData: TagData;
        htmlData: HTMLContentData;
        contentData: ContentData;
        classNameData: ClassNameData;
        buttonData: ButtonData;
        assetData: AssetData;
    };
    update: (
        type: keyof ElementEditorProps["data"],
        edits: Partial<
            ElementEditorProps["data"][keyof ElementEditorProps["data"]]
        >,
    ) => void;
}

export default function ElementEditor({
    component,
    update,
    data,
}: ElementEditorProps): React.JSX.Element {
    return (
        <section className="space-y-2">
            {isElementEditorAvailableForComponent("html", component) && (
                <HTMLContent
                    data={data.htmlData}
                    update={(d) => update("htmlData", d)}
                />
            )}
            {isElementEditorAvailableForComponent("button", component) && (
                <ButtonEditor
                    data={data.buttonData}
                    update={(d) => update("buttonData", d)}
                />
            )}
            {isElementEditorAvailableForComponent("tag", component) && (
                <TagEditor
                    data={data.tagData}
                    update={(d) => update("tagData", d)}
                />
            )}
            {isElementEditorAvailableForComponent("asset", component) && (
                <AssetEditor
                    data={data.assetData}
                    update={(d) => update("assetData", d)}
                />
            )}
            {isElementEditorAvailableForComponent("content", component) && (
                <ContentEditor
                    data={data.contentData}
                    update={(d) => update("contentData", d)}
                />
            )}
            {isElementEditorAvailableForComponent("classname", component) && (
                <ClassNameEditor
                    data={data.classNameData}
                    update={(d) => update("classNameData", d)}
                />
            )}
        </section>
    );
}

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
}

export default function ElementEditor({
    component,
    data,
}: ElementEditorProps): React.JSX.Element {
    return (
        <section className="space-y-2">
            {isElementEditorAvailableForComponent("html", component) && (
                <HTMLContent data={data.htmlData} update={() => {}} />
            )}
            {isElementEditorAvailableForComponent("button", component) && (
                <ButtonEditor data={data.buttonData} update={() => {}} />
            )}
            {isElementEditorAvailableForComponent("tag", component) && (
                <TagEditor data={data.tagData} update={() => {}} />
            )}
            {isElementEditorAvailableForComponent("asset", component) && (
                <AssetEditor data={data.assetData} update={() => {}} />
            )}
            {isElementEditorAvailableForComponent("content", component) && (
                <ContentEditor data={data.contentData} update={() => {}} />
            )}
            {isElementEditorAvailableForComponent("classname", component) && (
                <ClassNameEditor data={data.classNameData} update={() => {}} />
            )}
        </section>
    );
}

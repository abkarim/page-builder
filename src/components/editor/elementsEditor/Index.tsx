import { isElementEditorAvilableForComponent } from "@/util/EditorAndComponentConnection";
import HTMLContent from "./HTMLContent";
import ButtonEditor from "./Button";
import TagEditor from "./Tag";
import ClassNameEditor from "./ClassName";
import ContentEditor from "./Content";
import AssetEditor from "./Asset";

interface Props {
  component: string;
}

export default function ElementEditor({ component }: Props): React.JSX.Element {
  return (
    <section>
      {isElementEditorAvilableForComponent("html", component) && (
        <HTMLContent />
      )}
      {isElementEditorAvilableForComponent("button", component) && (
        <ButtonEditor />
      )}
      {isElementEditorAvilableForComponent("tag", component) && <TagEditor />}
      {isElementEditorAvilableForComponent("asset", component) && (
        <AssetEditor />
      )}
      {isElementEditorAvilableForComponent("content", component) && (
        <ContentEditor />
      )}
      {isElementEditorAvilableForComponent("classname", component) && (
        <ClassNameEditor />
      )}
    </section>
  );
}

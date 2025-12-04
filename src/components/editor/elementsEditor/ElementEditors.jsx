import PropType from 'prop-types';
import ChangeTag from './ChangeTag';
import ChangeText from './ChangeText';
import getAcceptedEdit from '../../util/getAcceptedEdit';
import HTMLContent from './HTMLContent';
import ChangeSrc from './ChangeSrc';
import ChangeAlt from './ChangeAlt';

export default function ElementEditors({
  elementClassName,
  elementsBlockId,
  iframe,
}) {
  const acceptedEdit = getAcceptedEdit(elementsBlockId);

  return (
    <div className="space-y-3">
      {acceptedEdit.includes('text') && (
        <ChangeText element={elementClassName} iframe={iframe} />
      )}
      {acceptedEdit.includes('src') && (
        <ChangeSrc element={elementClassName} iframe={iframe} />
      )}
      {acceptedEdit.includes('alt') && (
        <ChangeAlt element={elementClassName} iframe={iframe} />
      )}
      {acceptedEdit.includes('HTMLContent') && (
        <HTMLContent
          element={elementClassName}
          elementBlockId={elementsBlockId}
          iframe={iframe}
        />
      )}
      {acceptedEdit.includes('tag') && (
        <ChangeTag
          element={elementClassName}
          elementBlockId={elementsBlockId}
          iframe={iframe}
        />
      )}
      {acceptedEdit.length === 0 && <h1>Sorry, no option available</h1>}
    </div>
  );
}

ElementEditors.propTypes = {
  elementClassName: PropType.string,
  elementsBlockId: PropType.number,
  iframe: PropType.any,
};

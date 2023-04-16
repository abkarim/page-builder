import PropType from 'prop-types';
import ChangeTag from './ChangeTag';
import ChangeText from './ChangeText';
import getAcceptedEdit from '../../util/getAcceptedEdit';

export default function ElementEditors({
  elementClassName,
  elementsBlockId,
  iframe,
}) {
  const acceptedEdit = getAcceptedEdit(elementsBlockId);

  return (
    <div className="space-y-3">
      {acceptedEdit.includes('tag') && (
        <ChangeTag
          element={elementClassName}
          elementBlockId={elementsBlockId}
          iframe={iframe}
        />
      )}
      {acceptedEdit.includes('text') && (
        <ChangeText element={elementClassName} iframe={iframe} />
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

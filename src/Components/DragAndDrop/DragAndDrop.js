import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useState } from 'react';
import {
  addEmpty,
  createElementReferences,
  initialPos,
  isInside,
  moveElement,
  moveElements,
  setTemp,
} from './DandDMethods';

export default function DragAndDrop({ duration, list_, contRef, elementclassName, containerclassName }) {
  const [list, setList] = useState(list_);
  const [draggedElement, setDraggedElement] = useState(undefined);
  const [parent, enableAnimations] = useAutoAnimate({ duration: duration });

  useEffect(() => {
    createElementReferences(list_, setList);
  }, [list_]);

  useEffect(() => {
    if (!draggedElement) return;

    const handleMouseMove = (evt) => {
      moveElement(draggedElement, evt);
      moveEmptyElement(draggedElement.ref, evt);
    };

    const handleMouseUp = (evt) => {
      handleDrop(list.findIndex((el) => el._id === 'empty'));
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [draggedElement]);

  const moveEmptyElement = (ref) => {
    let draggedEl = list.find((el) => el.dragged);
    let draggedIndex = list.findIndex((el) => el._id === 'empty');

    for (let i = 0; i < list.length; i++) {
      let el = list[i];
      if (!draggedElement.enable && el !== draggedEl && el._id !== 'empty' && isInside(ref, el)) {
        moveElements(draggedElement, setDraggedElement, list, setList, draggedIndex, i); //set enable animtion to false and set new state
        setTemp(draggedElement, setDraggedElement); //Does not let to move empty until animation is finished
        break;
      }
    }
  };

  const handleDrop = (draggedIndex) => {
    let newList = list.filter((rd) => rd._id !== 'empty');
    newList.splice(draggedIndex, 0, draggedElement);
    setDraggedElement(undefined);
    setList([...newList]);
  };

  const handleDrag = async (mouseDown, ref) => {
    mouseDown.stopPropagation();
    let draggedEl = list.find((el) => el.ref === ref);
    let draggedIndex = list.findIndex((el) => el.ref === ref);
    initialPos(ref, draggedEl, contRef);
    addEmpty(ref, draggedIndex, draggedEl, list);
    setList(list.filter((r) => r !== draggedEl));
    draggedEl['mouseDown'] = mouseDown;
    setDraggedElement(draggedEl);
  };

  return (
    <>
      {list && (
        <div ref={parent} className={containerclassName}>
          {list.map((l) => {
            return (
              <div
                ref={l.ref}
                className={elementclassName}
                key={l._id}
                onMouseDown={(evt) => handleDrag(evt, l.ref)}
                style={l.extraStyle ? { ...l.extraStyle } : {}}
              >
                {l.renderMethod}
              </div>
            );
          })}
        </div>
      )}
      {draggedElement && (
        <div
          className="dashboardContainer"
          ref={draggedElement.ref}
          style={{
            position: 'absolute',
            ...draggedElement.extraStyle,
            transform: 'translate(' + draggedElement.x + 'px,' + draggedElement.y + 'px)',
            zIndex: '10000',
          }}
        >
          {draggedElement.renderMethod}
        </div>
      )}
    </>
  );
}

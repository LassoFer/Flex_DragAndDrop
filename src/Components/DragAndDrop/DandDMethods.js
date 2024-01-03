import { createRef } from 'react';

/////First render methods////////

export const createElementReferences = (list_, setList) => {
  if (!list_ || list_.length === 0) return;
  setList(
    list_.map((l) => {
      l['ref'] = createRef();
      l['x'] = 0;
      l['y'] = 0;
      return l;
    }),
  );
};

////Starting dragging////

export const initialPos = (ref, draggedEl, contRef) => {
  const coords = ref.current.getBoundingClientRect();
  const coordsCont = contRef.current.getBoundingClientRect();
  draggedEl.x = coords.x - coordsCont.x;
  draggedEl.y = coords.y - coordsCont.y;
};

export const addEmpty = (ref, draggedIndex, draggedEl, list) => {
  list.splice(draggedIndex, 0, {
    _id: 'empty',
    extraStyle: {
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    },
  });
  draggedEl['extraStyle'] = {
    width: ref.current.offsetWidth,
    height: ref.current.offsetHeight,
  };
};

////Moving methods////

export const moveElement = (draggedElement, evt) => {
  let difx = draggedElement.x + evt.pageX - draggedElement.mouseDown.pageX;
  let dify = draggedElement.y + evt.pageY - draggedElement.mouseDown.pageY;
  draggedElement.ref.current.style.transform = 'translate(' + difx + 'px,' + dify + 'px)';
};

export const moveElements = (draggedElement, setDraggedElement, list, setList, draggedIndex, i) => {
  draggedElement['enable'] = true;
  setDraggedElement(Object.assign(draggedElement));
  let elements = list.splice(draggedIndex, 1);
  list.splice(i, 0, ...elements);
  setList([...list]);
};

export const isInside = (ref, el) => {
  let coords = el.ref?.current.getBoundingClientRect();
  let refCoords = ref.current.getBoundingClientRect();
  let middleY = refCoords.y + refCoords.height / 2;
  let middleX = refCoords.x + refCoords.width / 2;
  let elCoords = {
    x: coords.x,
    xM: coords.width,
    y: coords.y,
    yM: coords.bottom,
  };

  let inside =
    middleX > elCoords.x && middleX < elCoords.x + elCoords.xM && middleY > elCoords.y && middleY < elCoords.yM;
  return inside;
};

export const setTemp = (draggedElement, setDraggedElement) =>
  setTimeout(() => {
    draggedElement['enable'] = false;
    setDraggedElement(Object.assign(draggedElement));
  }, 200);

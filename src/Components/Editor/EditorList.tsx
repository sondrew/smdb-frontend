import React, { Dispatch, SetStateAction } from 'react';
import { RecommendedItem } from '../../Models/FrontendModels';
import { List } from '@chakra-ui/react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import EditorListItem from './EditorListItem';

interface EditorListProps {
  listItems: RecommendedItem[];
  setListItems: Dispatch<SetStateAction<RecommendedItem[]>>;
}

const EditorList: React.FC<EditorListProps> = ({ listItems, setListItems }) => {
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!!destination && !!source) {
      setListItems((prevState) => {
        let newSort = [...prevState];
        const moveElement = newSort[result.source.index];
        newSort.splice(source.index, 1);
        newSort.splice(destination.index, 0, moveElement);
        return newSort;
      });
    }
  };

  const setMediaItemComment = (index: number, comment: string) => {
    setListItems((prevState) => {
      const updatedItem = {
        ...prevState[index],
        userComment: comment,
      };

      return [...prevState.slice(0, index), updatedItem, ...prevState.slice(index + 1)];
    });
  };

  return (
    <DragDropContext onDragEnd={(dropResult) => handleOnDragEnd(dropResult)}>
      <Droppable droppableId="mediaItem">
        {(provided) => (
          <List {...provided.droppableProps} ref={provided.innerRef}>
            {listItems.map((mediaItem, mediaItemIndex) => (
              <Draggable
                draggableId={mediaItem.id.toString()}
                index={mediaItemIndex}
                key={mediaItem.id}
              >
                {(providedItem) => (
                  <EditorListItem
                    item={mediaItem}
                    draggableProvided={providedItem}
                    index={mediaItemIndex}
                    setItemComment={setMediaItemComment}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

EditorList.displayName = 'EditorList';
export default EditorList;

import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { SearchItem } from '../Models/BackendModels';
import { RecommendationList } from '../State/Atoms';
import {
  Badge,
  Box,
  Container,
  Heading,
  Image,
  Input,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

const ListEditor: React.FC = () => {
  const [listName, setListName] = useState<string>('');
  const [listDescription, setListDescription] = useState<string>('');

  const [recommendationList, setRecommendationList] =
    useRecoilState<SearchItem[]>(RecommendationList);

  const [editedList, setEditedList] =
    useState<SearchItem[]>(recommendationList);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!!destination && !!source) {
      const newSort = [...editedList];
      const element = newSort[result.source.index];
      newSort.splice(source.index, 1);
      newSort.splice(destination.index, 0, element);
      setEditedList(newSort);
    }
  };

  return (
    <DragDropContext onDragEnd={(dropResult) => handleOnDragEnd(dropResult)}>
      <Container>
        {editedList.length === 0 && (
          <Heading as="h2" size="lg" pt={3} mb={6}>
            You have no movies or shows to edit, go to the{' '}
            <Link style={{ color: 'blue' }} to="/">
              main page
            </Link>
          </Heading>
        )}
        {editedList.length > 0 && (
          <>
            <Heading pt={3} mb={6} as="h1" size="md">
              List editor
            </Heading>
            <Input
              onChange={(event) => setListName(event.target.value)}
              pl={5}
              value={listName}
              fontSize={'x-large'}
              variant="flushed"
              size="lg"
              placeholder="Name of list"
              mb={5}
            />

            <Input
              onChange={(event) => setListDescription(event.target.value)}
              pl={5}
              value={listDescription}
              fontSize={'large'}
              variant="flushed"
              size="lg"
              placeholder="Description (optional)"
              mb={5}
            />
            <Droppable droppableId="mediaItem">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {editedList.map((mediaItem, index) => (
                    <Draggable
                      draggableId={mediaItem.id.toString()}
                      index={index}
                      key={mediaItem.id}
                    >
                      {(providedItem) => (
                        <ListItem
                          ref={providedItem.innerRef}
                          {...providedItem.draggableProps}
                          {...providedItem.dragHandleProps}
                        >
                          <Box
                            border="1px"
                            borderColor="grey"
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            _hover={{
                              backgroundColor: 'black',
                              cursor: 'row-resize',
                            }}
                            p={1}
                            maxH={80}
                          >
                            <Image
                              objectFit={'fill'}
                              maxW={60}
                              maxH={100}
                              src={mediaItem.posterUrl}
                              alt={`Poster of movie ${mediaItem.title}`}
                              // fallbackSrc={fallbackPoster}
                            />
                            <Text fontSize="lg" as="h6" pl={3}>
                              {mediaItem.title}
                              <Text
                                display="inline-flex"
                                color="lightgray"
                                pl={2}
                              >
                                ({mediaItem.releaseDate.substring(0, 4)})
                              </Text>
                            </Text>
                            <Badge
                              alignSelf="flex-start"
                              marginLeft="auto"
                              borderRadius="full"
                              px="2"
                              py={1}
                              color="white"
                              backgroundColor={
                                mediaItem.mediaType.toString() === 'tv'
                                  ? 'green'
                                  : 'red'
                              }
                              textShadow="0 0 3px black"
                            >
                              {mediaItem.mediaType.toString().toUpperCase()}
                            </Badge>
                          </Box>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </>
        )}
      </Container>
    </DragDropContext>
  );
};

ListEditor.displayName = 'ListEditor';
export default ListEditor;

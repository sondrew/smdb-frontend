import React from 'react';
import {
  Badge,
  Box,
  Flex,
  Image,
  Input,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { RecommendedItem } from '../../Models/FrontendModels';
import { DraggableProvided } from 'react-beautiful-dnd';

interface EditorListItemProps {
  item: RecommendedItem;
  index: number;
  draggableProvided: DraggableProvided;
  setItemComment: (index: number, comment: string) => void;
}

const EditorListItem: React.FC<EditorListItemProps> = ({
  item,
  index,
  draggableProvided,
  setItemComment,
}) => {
  const fallbackPosterUrl: string =
    'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';

  return (
    <ListItem
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
      {...draggableProvided.dragHandleProps}
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
        <Flex w={10} flexDirection="column" alignItems="center">
          <Text fontSize="md">▲</Text>
          <Text fontSize="xl">{index + 1}</Text>
          <Text fontSize="md">▼</Text>
        </Flex>
        <Image
          objectFit={'fill'}
          maxW={60}
          maxH={100}
          src={item.posterUrl ?? ''}
          alt={`Poster of movie ${item.title}`}
          fallbackSrc={fallbackPosterUrl}
        />
        <Flex flexDirection="column">
          <Text fontSize="lg" as="h6" pl={3}>
            {item.title}
            <Text display="inline-flex" color="lightgray" pl={2}>
              ({item.releaseDate.substring(0, 4)})
            </Text>
          </Text>
          <Input
            onChange={(event) => setItemComment(index, event.target.value)}
            pl={1}
            ml={2}
            value={item.userComment}
            fontSize="sm"
            variant="flushed"
            size="md"
            placeholder="Comment (optional)"
            mb={5}
          />
        </Flex>
        <Badge
          alignSelf="flex-start"
          marginLeft="auto"
          borderRadius="full"
          px="2"
          py={1}
          color="white"
          backgroundColor={item.mediaType.toString() === 'tv' ? 'green' : 'red'}
          textShadow="0 0 3px black"
        >
          {item.mediaType.toString().toUpperCase()}
        </Badge>
      </Box>
    </ListItem>
  );
};

EditorListItem.displayName = 'EditorListItem';
export default EditorListItem;

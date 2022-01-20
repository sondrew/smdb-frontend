import React, { useState } from 'react';
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
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ListEditor: React.FC = () => {
  const [listName, setListName] = useState<string>('');
  const [listDescription, setListDescription] = useState<string>('');

  const [recommendationList, setRecommendationList] =
    useRecoilState<SearchItem[]>(RecommendationList);

  return (
    <Container>
      {recommendationList.length === 0 && (
        <Heading as="h2" size="lg" pt={3} mb={6}>
          You have no movies or shows to edit, go to the{' '}
          <Link style={{ color: 'blue' }} to="/">
            main page
          </Link>
        </Heading>
      )}
      {recommendationList.length > 0 && (
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

          {recommendationList.map((mediaItem, index) => (
            <Box
              border="1px"
              borderColor="grey"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              _hover={{ backgroundColor: 'black', cursor: 'row-resize' }}
              p={1}
              maxH={80}
              key={mediaItem.id}
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
                <Text display="inline-flex" color="lightgray" pl={2}>
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
                  mediaItem.mediaType.toString() === 'tv' ? 'green' : 'red'
                }
                textShadow="0 0 3px black"
              >
                {mediaItem.mediaType.toString().toUpperCase()}
              </Badge>
            </Box>
          ))}
        </>
      )}
    </Container>
  );
};

ListEditor.displayName = 'ListEditor';
export default ListEditor;

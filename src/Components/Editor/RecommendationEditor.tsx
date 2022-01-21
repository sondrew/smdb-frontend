import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { SearchItem } from '../../Models/BackendModels';
import { SearchList } from '../../State/Atoms';
import { Container, Heading, Input } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { RecommendedItem } from '../../Models/FrontendModels';
import EditorList from './EditorList';

const RecommendationEditor: React.FC = () => {
  const [searchList] = useRecoilState<SearchItem[]>(SearchList);
  const [recommendationList, setRecommendationList] = useState<
    RecommendedItem[]
  >(
    searchList.map((item) => ({
      id: item.id,
      title: item.title,
      mediaType: item.mediaType,
      releaseDate: item.releaseDate,
      posterUrl: item.posterUrl ?? '',
      userComment: '',
      userRating: null,
    }))
  );

  const [listName, setListName] = useState<string>('');
  const [listDescription, setListDescription] = useState<string>('');

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
          <EditorList
            listItems={recommendationList}
            setListItems={setRecommendationList}
          />
        </>
      )}
    </Container>
  );
};

RecommendationEditor.displayName = 'ListEditor';
export default RecommendationEditor;

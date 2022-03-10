import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { SearchItem, ViewRecommendationList } from '../../Models/BackendModels';
import { SearchList } from '../../State/Atoms';
import { Button, Container, Flex, Heading, Input } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreateRecommendationList,
  RecommendedItem,
} from '../../Models/FrontendModels';
import EditorList from './EditorList';
import { createRecommendationList } from '../../State/DataFetch';

const RecommendationEditor: React.FC = () => {
  const navigate = useNavigate();
  const [listName, setListName] = useState<string>('');
  const [listDescription, setListDescription] = useState<string>('');
  const [searchList] = useRecoilState<SearchItem[]>(SearchList);
  const [recommendationList, setRecommendationList] = useState<
    RecommendedItem[]
  >(
    searchList.map((item) => ({
      id: item.id,
      title: item.title,
      mediaType: item.mediaType,
      releaseDate: item.releaseDate,
      posterUrl: item.posterUrl ?? null,
      userComment: '',
      userRating: null,
    }))
  );

  const submitRecommendationList = () => {
    console.log('hit submit');
    // validate-
    if (listName.length > 0 && recommendationList.length > 0) {
      const createList: CreateRecommendationList = {
        listName: listName,
        listDescription: listDescription,
        list: recommendationList.map((item, index) => ({
          tmdbId: item.id,
          index: index,
          mediaType: item.mediaType,
          userComment: item.userComment,
          userRating: item.userRating,
        })),
      };

      console.log({ createList });

      createRecommendationList(createList)
        .then((res) => {
          console.log({ res });

          navigate(`/${res.id}`, {
            state: res as ViewRecommendationList,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

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
          <Flex justifyContent="flex-end">
            <Button
              onClick={submitRecommendationList}
              size="md"
              m={3}
              backgroundColor={'green.400'}
              _hover={{ backgroundColor: 'green.200' }}
            >
              Save
            </Button>
          </Flex>
        </>
      )}
    </Container>
  );
};

RecommendationEditor.displayName = 'ListEditor';
export default RecommendationEditor;

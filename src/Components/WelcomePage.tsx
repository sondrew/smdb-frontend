import React, { useEffect, useRef, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import useDebounce from '../Hooks/useDebounce';
import { SearchItem } from '../Models/BackendModels';
import { searchMovieAndTV } from '../State/DataFetch';
import { useRecoilState } from 'recoil';
import { RecommendationList } from '../State/Atoms';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchItem[]>([]);
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const [searchFailed, setSearchFailed] = useState<boolean>(false);

  const [recommendationList, setRecommendationList] =
    useRecoilState<SearchItem[]>(RecommendationList);

  const debouncedSearchQuery = useDebounce<string>(searchQuery, 200);

  const fallbackPosterUrl: string =
    'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';

  useEffect(() => {
    setSearchFailed(false);
    if (debouncedSearchQuery.length >= 2) {
      searchMovieAndTV(debouncedSearchQuery)
        .then((res) => setSearchResult(res))
        .catch((e) => setSearchFailed(true));
    } else {
      setSearchResult([]);
    }
  }, [debouncedSearchQuery]);

  // https://ipapi.co/json/ get client country to get streaming providers for lists

  const addItemToRecommendationList = (item: SearchItem) => {
    setRecommendationList((prevState) => [...prevState, item]);
    // check movie/show doesn't exist in list already?
    setSearchResult([]);
    setSearchQuery('');
    inputSearchRef?.current?.focus();
  };

  // handle search with no results

  return (
    <Box>
      <Heading pt={3} mb={6} textAlign="center">
        Create recommendations!
      </Heading>

      <Flex mt={20} justifyContent="center">
        <Box
          w={{
            zero: '95%',
            xxs: '95%',
            xs: '90%',
            sm: '60%',
            md: '30%',
            lg: '25%',
            xl: '20%',
            xxl: '16%',
          }}
        >
          <Box my={10}>
            {recommendationList.length > 0 && (
              <>
                <Heading as="h5" size="sm">
                  Recommendations added:
                </Heading>
                <ol>
                  {recommendationList.map((listItem) => (
                    <li key={listItem.id}>{listItem.title}</li>
                  ))}
                </ol>
              </>
            )}
          </Box>
          <Input
            onChange={(event) => setSearchQuery(event.target.value)}
            pl={5}
            value={searchQuery}
            fontSize={'x-large'}
            variant="flushed"
            size="lg"
            placeholder="Search movie/show"
            mb={5}
            ref={inputSearchRef}
          />
          {searchFailed && (
            <Box display="flex" justifyContent="center" mt={10}>
              <Heading as="h2" size="md" color={'red.300'}>
                Search failed, pls try again later
              </Heading>
            </Box>
          )}
          {searchResult.length > 0 &&
            searchResult.map((item) => (
              <Box
                onClick={() => addItemToRecommendationList(item)}
                border="1px"
                borderColor="grey"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                _hover={{ backgroundColor: 'grey', cursor: 'pointer' }}
                p={1}
                maxH={80}
                key={item.id}
              >
                <Image
                  objectFit={'fill'}
                  maxW={60}
                  maxH={100}
                  src={item.posterUrl}
                  alt={`Poster of movie ${item.title}`}
                  fallbackSrc={fallbackPosterUrl}
                />
                <Text fontSize="lg" as="h6" pl={3}>
                  {item.title}
                </Text>
                <Text color="lightgray" pl={2}>
                  ({item.releaseDate.substring(0, 4)})
                </Text>
              </Box>
            ))}
        </Box>
      </Flex>
    </Box>
  );
};

WelcomePage.displayName = 'WelcomePage';
export default WelcomePage;

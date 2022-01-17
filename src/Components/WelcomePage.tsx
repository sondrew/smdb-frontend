import React, {
  ChangeEvent,
  LegacyRef,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Center,
  Flex,
  GridItem,
  Heading,
  Image,
  Input,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import useDebounce from '../Hooks/useDebounce';
import { SearchItem } from '../Models/BackendModels';
import { searchMovieAndTV } from '../State/DataFetch';
import { useRecoilState } from 'recoil';
import { RecommendationList } from '../State/Atoms';

const WelcomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchItem[]>([]);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const [recommendationList, setRecommendationList] =
    useRecoilState<SearchItem[]>(RecommendationList);

  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);

  const fallbackPosterUrl: string =
    'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';

  useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      searchMovieAndTV(debouncedSearchQuery).then((res) =>
        setSearchResult(res)
      );
    } else {
      setSearchResult([]);
    }
  }, [debouncedSearchQuery]);

  const addItemToRecommendationList = (item: SearchItem) => {
    setRecommendationList((prevState) => [...prevState, item]);
    // check movie/show doesn't extist in list already?
    setSearchResult([]);
    setSearchQuery('');
    inputSearchRef?.current?.focus();
  };

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

import { useEffect, useRef, useState } from 'react';

import { Badge, Box, Button, Flex, Heading, Image, Input, Text } from '@chakra-ui/react';
import useDebounce from '../Hooks/useDebounce';
import { useRecoilState } from 'recoil';
import { SearchList } from '../State/Atoms';
import { Link } from 'react-router-dom';
import useKeyPress from '../Hooks/useKeyPress';
import { searchMoviesAndTV } from '../firebase';
import { SearchItem } from '../../shared/models';

const WelcomePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchItem[]>([]);
  const [searchFailed, setSearchFailed] = useState<boolean>(false);
  const [searchList, setSearchList] = useRecoilState<SearchItem[]>(SearchList);
  const [selectedSearchItem, setSelectedSearchItem] = useState<number | null>(null);

  const debouncedSearchQuery = useDebounce<string>(searchQuery, 200);

  const inputSearchRef = useRef<HTMLInputElement>(null);
  const keypressRef = useRef<HTMLDivElement>(null);

  const downPress = useKeyPress('ArrowDown', keypressRef);
  const upPress = useKeyPress('ArrowUp', keypressRef);
  const enterPress = useKeyPress('Enter', keypressRef);

  const addSelectedItemToRecommendationList = (item: SearchItem) => {
    setSelectedSearchItem(null);
    setSearchList((prevState) => [...prevState, item]);
    setSearchResult([]);
    setSearchQuery('');
    inputSearchRef?.current?.focus();
  };

  // Search for movie/show on debounced query change
  useEffect(() => {
    setSearchFailed(false);
    if (debouncedSearchQuery.length > 2) {
      searchMoviesAndTV(debouncedSearchQuery)
        .then((data) => {
          setSearchResult(data.data);
          setSelectedSearchItem(null);
        })
        .catch((e) => {
          console.error(e);
          setSearchFailed(true);
        });
    }
  }, [debouncedSearchQuery]);

  // Remove search results and reset selected item if debounced query is < 2 characters
  useEffect(() => {
    if (debouncedSearchQuery.length <= 2 && searchResult.length > 0) {
      setSelectedSearchItem(null);
      setSearchResult([]);
    }
  }, [debouncedSearchQuery, searchResult.length]);

  // Navigate in search list using up/down keys
  useEffect(() => {
    if (searchResult.length && (downPress || upPress)) {
      if (selectedSearchItem === null) {
        if (downPress) setSelectedSearchItem(0);
        if (upPress) setSelectedSearchItem(searchResult.length - 1);
      } else {
        if (downPress) {
          setSelectedSearchItem((prevItem) =>
            prevItem! < searchResult.length ? prevItem! + 1 : null
          );
        } else if (upPress) {
          setSelectedSearchItem((prevItem) => (prevItem! > 0 ? prevItem! - 1 : null));
        }
      }
    }
    // TODO: Scroll screen if navigating to list item outside of viewport
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downPress, searchResult.length, upPress]);

  // Add selected search item to list when pressing enter key
  useEffect(() => {
    if (selectedSearchItem != null && enterPress) {
      addSelectedItemToRecommendationList(searchResult[selectedSearchItem]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSearchItem, enterPress]);

  // https://ipapi.co/json/ get client country to get streaming providers for lists
  // TODO: handle search with no results - generally better search and request handling
  // TODO: ping functions on website load to avoid cold start?

  return (
    <Box>
      <Heading pt={3} mb={6} textAlign="center">
        Create recommendations!
      </Heading>
      <Flex mt={20} justifyContent="center" ref={keypressRef}>
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
            {searchList.length > 0 && (
              <>
                <Heading as="h5" size="sm">
                  Recommendations added:
                </Heading>
                <ol>
                  {searchList.map((listItem) => (
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
            searchResult.map((item, index) => (
              <Box
                onMouseEnter={() => setSelectedSearchItem(index)}
                onMouseLeave={() => setSelectedSearchItem(null)}
                onClick={() => addSelectedItemToRecommendationList(item)}
                border="1px"
                borderColor="grey"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                backgroundColor={selectedSearchItem === index ? 'grey' : ''}
                _hover={{ cursor: 'pointer' }}
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
                />
                <Text fontSize="lg" as="h6" pl={3}>
                  {item.title}
                  {item.releaseDate !== null && (
                    <Text display="inline-flex" color="lightgray" pl={2}>
                      ({item.releaseDate.substring(0, 4)})
                    </Text>
                  )}
                </Text>
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
            ))}
        </Box>
      </Flex>
      <Flex justifyContent="flex-end">
        <Link to={'/edit'}>
          <Button
            size="md"
            m={3}
            backgroundColor={'green.400'}
            _hover={{ backgroundColor: 'green.200' }}
          >
            Next
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

WelcomePage.displayName = 'WelcomePage';
export default WelcomePage;

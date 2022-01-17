import React, { ChangeEvent, useEffect, useState } from 'react';
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

const WelcomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchItem[]>([]);
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 500);

  const fallbackPosterUrl: string =
    'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';

  useEffect(() => {
    searchMovieAndTV(debouncedSearchQuery).then((res) => setSearchResult(res));
  }, [debouncedSearchQuery]);

  return (
    <Box>
      <Heading pt={3} mb={6} textAlign="center">
        Create recommendations!
      </Heading>

      <Flex mt={40} justifyContent="center">
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
          <Input
            onChange={(event) => setSearchQuery(event.target.value)}
            pl={5}
            value={searchQuery}
            fontSize={'x-large'}
            variant="flushed"
            size="lg"
            placeholder="Search movie/show"
            mb={5}
          />
          {searchResult.length > 0 &&
            searchResult.map((item) => (
              <Box
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
                  {item.title} {/*Year*/}
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

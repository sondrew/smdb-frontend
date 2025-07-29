import { MediaType, RecommendedMedia, WatchProvider } from '../../shared/models';
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Country } from '../../countries';

const ViewRecommendationListItem = ({
  item,
  countryCode,
  clientCountry,
}: {
  item: RecommendedMedia;
  countryCode: string | null | undefined;
  clientCountry: Country | null,
}) => {
  const [showDescription, setShowDescription] = useState<boolean>(false);

  const countryProviders =
    item && countryCode && item.countriesWithProviders && item.countriesWithProviders[countryCode]
      ? item.countriesWithProviders[countryCode]
      : null;

  const itemHasProviders =
    !!countryProviders &&
    (countryProviders.flatrate.length > 0 ||
      countryProviders.buy.length > 0 ||
      countryProviders.rent.length > 0);

  // TODO: Improve this helper function
  const getListOfProviders = (providers: WatchProvider[]): JSX.Element[] => {
    return providers.map((provider) => (
      <img
        key={`${item.id}-${provider.providerId}`}
        style={{ height: '30px', marginLeft: '5px' }}
        src={`https://image.tmdb.org/t/p/original/${provider.logoPath}`}
        alt={`${provider.providerName}`}
      />
    ));
  };

  //const alternativeStreamingProviders = !!countryCode && item?.countriesWithProviders && clientCountry ?
  //  clientCountry.neighbouringCountryCodes.map(neigbourCountryCode => item.countriesWithProviders ? item.countriesWithProviders[neigbourCountryCode].flatrate : []);

  return (
    <Box key={item.id} m={1} border="1px solid yellow">
      {' '}
      {/* endre på dette, test ut neumorphism til css*/}
      <Flex flexDirection="row">
        <Flex flexDirection="column" mx={3} alignItems="center" justifyContent="center">
          <Text fontSize="4xl">{item.listIndex + 1}</Text>
          <Image
            objectFit={'fill'}
            maxW={60}
            maxH={100}
            src={item.posterPath ?? ''}
            alt={`Poster of ${item.title}`}
            //{/* fallback */}
          />
        </Flex>
        <Box padding={1}>
          <Heading as="h3" fontSize="lg">
            {item.title}
          </Heading>
          {item.userComment?.length !== 0 && (
            <Text fontStyle={'italic'} my={1}>
              "{item.userComment}"
            </Text>
          )}
          {item.description?.length !== 0 && (
            <>
              <Text
                color="lightgrey"
                _hover={{
                  color: 'white',
                  cursor: 'pointer',
                }}
                onClick={() => setShowDescription((prev) => !prev)}
              >
                Description (+)
              </Text>
              {showDescription && <Text color="lightgray">{item.description}</Text>}
            </>
          )}
          {itemHasProviders && (
            <Box marginTop="15px">
              <Box>
                {countryProviders.flatrate.length > 0 && (
                  <Flex marginTop="4px" flexDirection="row" height="30px" alignItems="center">
                    <div>Streaming:</div>
                    {getListOfProviders(countryProviders.flatrate)}
                  </Flex>
                )}
              </Box>
              <Box>
                {countryProviders.rent.length > 0 && (
                  <Flex marginTop="4px" flexDirection="row" height="30px" alignItems="center">
                    <div>Rent:</div>
                    {getListOfProviders(countryProviders.rent)}
                  </Flex>
                )}
              </Box>
              <Box>
                {countryProviders.buy.length > 0 && (
                  <Flex marginTop="4px" flexDirection="row" height="30px" alignItems="center">
                    <div>Buy:</div>
                    {getListOfProviders(countryProviders.buy)}
                  </Flex>
                )}
              </Box>
            </Box>
          )}
          {!itemHasProviders && (
            <Text color="lightgray" fontSize="sm">
              No providers for this ${item.mediaType === MediaType.MOVIE ? 'movie' : 'tv show'} in
              your country
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

ViewRecommendationListItem.displayName = 'ViewRecommendationListItem';
export default ViewRecommendationListItem;

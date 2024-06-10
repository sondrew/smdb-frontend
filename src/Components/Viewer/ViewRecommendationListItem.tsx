import { RecommendedMedia, WatchProvider } from '../../../shared/models';
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';

const ViewRecommendationListItem = ({
  item,
  countryCode,
}: {
  item: RecommendedMedia;
  countryCode: string | null | undefined;
}) => {
  const [showDescription, setShowDescription] = useState<boolean>(false);
  return (
    <Box key={item.id} m={1} border="1px solid yellow">
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
        </Box>
      </Flex>
    </Box>
  );
};

ViewRecommendationListItem.displayName = 'ViewRecommendationListItem';
export default ViewRecommendationListItem;

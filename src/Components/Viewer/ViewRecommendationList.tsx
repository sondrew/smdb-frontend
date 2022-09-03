import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { RecommendationList } from '../../Models/BackendModels';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { getRecommendationList } from '../../State/DataFetch';

const ViewRecommendationList: React.FC = () => {
  const { state } = useLocation(); // get recommendation list right after creation
  let { listId } = useParams();

  const [recommendations, setRecommendations] = useState<RecommendationList | null>(
    state as RecommendationList
  );

  useEffect(() => {
    if (recommendations == null && !!listId) {
      // validate and sanitize id, so that it does not request on all random stuff that is not a valid id
      // alphanumeric 8 characters
      console.log('did not pass recommendation list prop, retrieving');

      getRecommendationList(listId).then((res) => {
        console.log({ res });
        setRecommendations(res);
      });
    } else {
      console.log('sent recommendation list as prop, not retrieving');
      console.log({ recommendations });
    }
  }, []);

  console.log({ listId });

  const renderRecommendations = recommendations?.list != null && recommendations.list.length > 0;

  console.log({ state });

  return (
    <Container>
      <Heading as="h1" size="md" pt={2} mb={10}>
        Recommendation list
      </Heading>
      {renderRecommendations && (
        <>
          <Heading as="h2" size="lg" mb={3} color="grey">
            {recommendations.listName}
          </Heading>
          {!!recommendations?.listDescription && (
            <Heading as="h3" size="sm" mt={2} color="red">
              {recommendations.listDescription}
            </Heading>
          )}
          {recommendations.list.map((item) => (
            <Box key={item.id} m={1} border="1px solid yellow">
              <Text>{item.title}</Text>
              <Text color="grey">{item.description}</Text>
              <Text fontStyle={'italic'}>"{item.userComment}"</Text>
            </Box>
          ))}
        </>
      )}
    </Container>
  );
};

ViewRecommendationList.displayName = 'ViewRecommendationList';
export default ViewRecommendationList;

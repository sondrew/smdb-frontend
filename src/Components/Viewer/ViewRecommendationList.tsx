import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import { getRecommendationList } from '../../firestore';
import ViewRecommendationListItem from './ViewRecommendationListItem';
import { RecommendationList } from '../../../shared/models';
import { getListWithProviders, getProvidersForCountry } from '../../firebase';
import { GetProvidersForCountryRequest } from '../../../shared/requestModels';

const ViewRecommendationList = () => {
  const { state } = useLocation(); // get recommendation list right after creation
  let { listId } = useParams(); // get list id from url path
  console.log('listId', listId);

  const [recommendations, setRecommendations] = useState<RecommendationList | null>(
    state as RecommendationList
  ); // TODO: Differentiate between loading list and it not existing
  useEffect(() => {
    console.log('USE EFFECT');
    if (recommendations == null && !!listId) {
      //fetchRecommendationListUsingFirestoreClient();
      getRecommendationListUsingFunction();
    } else {
      console.log('sent recommendation list as prop, not retrieving');
      console.log({ recommendations });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // remove result list when query is removed
  // out of focus fjerne listen, in focus gå tilbake

  const fetchRecommendationListUsingFirestoreClient = () => {
    if (recommendations == null && !!listId) {
      // TODO: validate and sanitize id, so that it does not request on all random stuff that is not a valid id
      // alphanumeric 8 characters
      console.log('did not pass recommendation list prop, retrieving');
      getRecommendationList(listId)
        .then((res) => {
          console.log('');
          console.log('');
          console.log('res');
          console.log(res);
          // TODO: Sort list here or in backend - thought I'd done this already?
          setRecommendations(res);
        })
        .catch(() => {
          // TODO: Retrieving list failed, try again
        });
    } else {
      console.log('sent recommendation list as prop, not retrieving');
      console.log({ recommendations });
    }
  };

  const renderRecommendations = recommendations?.list != null && recommendations.list.length > 0;


  const getRecommendationListUsingFunction = () => {
    console.log('getLocalListWithProviders');

    getListWithProviders(listId)
      .then((response) => {
        const data = response.data;
        console.log('function data ', data);
        setRecommendations(data);
      })
      .catch((err) => {
        console.error('err', err);
      });
  };

  return (
    <Container>
      <Heading as="h1" size="md" pt={2} mb={8} color="grey">
        Recommender3000
      </Heading>
      {recommendations === null && (
        <h2>There's no recommendation list here! Go to our front page</h2>
      )}
      {renderRecommendations && (
        <Box>
          <Heading as="h2" size="lg" mb={3} color="white">
            {recommendations.listName}
          </Heading>
          {!!recommendations?.listDescription && (
            <Text as="i" mt={2} color="grey">
              "{recommendations.listDescription}"
            </Text>
          )}
          <Box mt={8}>
            {recommendations.list.map((item) => (
              <ViewRecommendationListItem key={item.id} item={item} />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

ViewRecommendationList.displayName = 'ViewRecommendationList';
export default ViewRecommendationList;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { getRecommendationList } from '../../firestore';
import ViewRecommendationListItem from './ViewRecommendationListItem';
import { RecommendationList } from '../../../shared/models';
import { getListWithProviders, getProvidersForCountry } from '../../firebase';
import { GetProvidersForCountryRequest } from '../../../shared/requestModels';
import { getClientCountryCode } from '../../httpClient';
import { countries } from '../../countries';

const ViewRecommendationList = () => {
  //const { state } = useLocation(); // get recommendation list right after creation // TODO: change this to fetch anyhow, as we want providers as well
  let { listId } = useParams(); // get list id from url path
  console.log('listId', listId);

  const [recommendations, setRecommendations] = useState<
    RecommendationList | 'loading' | 'missing' | null
  >(null);
  const [countryCode, setCountryCode] = useState<string | null | undefined>(null);

  useEffect(() => {
    if (countryCode == null) {
      console.log('countryCode is null, fetching');
      getClientCountryCode().then((code) => {
        console.log('countryCode', code);
        setCountryCode(code);
      });
    }

    console.log('Checking if list should be fetched. current state:', recommendations);
    if (recommendations == null && !!listId) {
      setRecommendations('loading');
      //fetchRecommendationListUsingFirestoreClient();
      getRecommendationListUsingFunction();
    } else {
      console.log('Recommendation list is already fetched, missing or loading');
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

  const renderRecommendations =
    recommendations !== null && recommendations !== 'loading' && recommendations !== 'missing';


  const getRecommendationListUsingFunction = () => {
    console.log('getLocalListWithProviders');

    getListWithProviders(listId)
      .then((response) => {
        const data = response.data ?? 'missing';
        console.log('function data ', data);
        setRecommendations(data);
      })
      .catch((err) => {
        console.error('err', err);
      });
  };

  const clientCountry = countryCode ? countries[countryCode] ?? null : null;

  return (
    <Container>
      <Heading as="h1" size="md" pt={2} mb={8} color="grey">
        Recommender3000
      </Heading>
      {/*<Button onClick={getProviders}>GetProvidersForCountry</Button>
        <Button onClick={getRecommendationListUsingFunction}>GetLocalListWithProviders</Button>*/}
      {recommendations === 'loading' && <h2>Loading recommendation list!</h2>}
      {recommendations === 'missing' && <h2>There is no recommendation list at this link!</h2>}
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
          {!!countryCode && <Box>Showing movie/tv show providers for {clientCountry?.localCountryName} {clientCountry?.flagEmoji}</Box>}
          <Box mt={8}>
            {recommendations.list.map((item, index) => (
              <ViewRecommendationListItem key={item.id} item={item} countryCode={countryCode} clientCountry={clientCountry} />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

ViewRecommendationList.displayName = 'ViewRecommendationList';
export default ViewRecommendationList;

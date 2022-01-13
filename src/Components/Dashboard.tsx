import React, { useEffect } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { Button, SimpleGrid } from '@chakra-ui/react';

import { DiscoverMovies } from '../State/Atoms';
import { getDiscoverMovies } from '../State/DataFetch';
import { TMDbMovie } from '../Models/BackendModels';
import MovieGridElement from './MovieGridElement';

const Dashboard: React.FC = () => {
  const [discoverMovies, setDiscoverMovies] =
    useRecoilState<Array<TMDbMovie>>(DiscoverMovies);

  useEffect(() => {
    if (discoverMovies.length === 0) {
      getDiscoverMovies()
        .then((data) => setDiscoverMovies(data))
        .catch((e) => {
          console.log(e);
        });
    }
  }, [discoverMovies.length, setDiscoverMovies]);

  console.log({ discoverMovies });

  return (
    <div style={{ marginTop: '4rem' }}>
      <SimpleGrid
        m={3}
        columns={{ sm: 2, md: 3, lg: 6, xl: 8, '2xl': 10 }}
        spacingX={4}
        spacingY={6}
      >
        {discoverMovies.length > 0 &&
          discoverMovies.map((movie) => (
            <MovieGridElement key={movie.id} movie={movie} />
          ))}
      </SimpleGrid>
    </div>
  );
};

Dashboard.displayName = 'Dashboard';
export default Dashboard;

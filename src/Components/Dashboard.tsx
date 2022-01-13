import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DiscoverMovies } from '../State/Atoms';
import { getDiscoverMovies } from '../State/DataFetch';
import { TMDbMovie } from '../Models/BackendModels';

const Dashboard: React.FC = () => {
  const [discoverMovies, setDiscoverMovies] =
    useRecoilState<Array<TMDbMovie>>(DiscoverMovies);

  const getMovies = () => {
    if (discoverMovies.length === 0) {
      getDiscoverMovies()
        .then((data) => setDiscoverMovies(data))
        .catch((e) => {
          console.log(e);
        });
    }
  };

  console.log({ discoverMovies });

  return (
    <div style={{ marginTop: '4rem' }}>
      <button onClick={getMovies}>Get movies</button>
      {discoverMovies.length > 0 &&
        discoverMovies.map((movie) => (
          <div>
            <span>{movie.title}</span>
          </div>
        ))}
    </div>
  );
};

Dashboard.displayName = 'Dashboard';
export default Dashboard;

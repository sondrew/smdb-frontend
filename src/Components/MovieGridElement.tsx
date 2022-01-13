import React from 'react';

import { TMDbMovie } from '../Models/BackendModels';
import { Box, Image } from '@chakra-ui/react';

interface MovieGridElementProps {
  movie: TMDbMovie;
}

const MovieGridElement: React.FC<MovieGridElementProps> = ({ movie }) => {
  const fallbackPosterUrl: string =
    'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';

  return (
    <Box
      borderRadius="md"
      border="solid"
      borderColor="white"
      borderWidth={1}
      overflow="hidden"
      backgroundColor="grey"
    >
      <Image
        objectFit="fill"
        src={movie.posterUrl}
        alt={`Poster of movie ${movie.title}`}
        fallbackSrc={fallbackPosterUrl}
      />
      <Box textAlign="center" letterSpacing="wide" p={2}>
        {movie.title}
      </Box>
    </Box>
  );
};

MovieGridElement.displayName = 'MovieGridElement';
export default MovieGridElement;

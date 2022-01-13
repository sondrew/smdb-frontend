import React from 'react';

import { TMDbMovie } from '../Models/BackendModels';
import { Box, Image } from '@chakra-ui/react';
import Star from './Star';
import RatingBadge from './RatingBadge';

interface MovieGridElementProps {
  movie: TMDbMovie;
  index: number;
  toggleFavourite: (index: number) => void;
}

const MovieGridElement: React.FC<MovieGridElementProps> = ({
  movie,
  toggleFavourite,
  index,
}) => {
  const fallbackPosterUrl: string =
    'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';

  return (
    <Box
      borderRadius="md"
      border="solid"
      borderColor={movie.markedFavourite ? 'blue.300' : 'blue.600'}
      borderWidth={1}
      overflow="hidden"
      backgroundColor={movie.markedFavourite ? 'blue.400' : 'blue.700'}
    >
      <Image
        objectFit="fill"
        src={movie.posterUrl}
        alt={`Poster of movie ${movie.title}`}
        fallbackSrc={fallbackPosterUrl}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={1}
      >
        <RatingBadge rating={movie.voteAverage} voteCount={movie.voteCount} />
        <Star
          favourite={movie.markedFavourite}
          toggleFavourite={() => toggleFavourite(index)}
        />
      </Box>
      <Box textAlign="center" letterSpacing="wide" p={2}>
        {movie.title}
      </Box>
    </Box>
  );
};

MovieGridElement.displayName = 'MovieGridElement';
export default MovieGridElement;

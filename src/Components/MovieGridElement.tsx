import React from 'react';

import { TMDbMovie } from '../Models/BackendModels';
import { Badge, Box, Image, Text } from '@chakra-ui/react';
import Star from './Star';

interface MovieGridElementProps {
  movie: TMDbMovie;
}

const MovieGridElement: React.FC<MovieGridElementProps> = ({ movie }) => {
  const fallbackPosterUrl: string =
    'https://st4.depositphotos.com/14953852/22772/v/600/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg';

  const calculateRatingColor = (rating: number) =>
    `hsla(${rating * 10}, 95%, 63%, 0.9)`;

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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={1}
      >
        <Box display="flex" alignItems="center">
          <Badge
            borderRadius="full"
            px="2"
            py={1}
            color="white"
            backgroundColor={calculateRatingColor(movie.voteAverage)}
            textShadow="0 0 3px black"
          >
            {movie.voteAverage}
          </Badge>
          <Text pl={2} fontSize="xs">
            {movie.voteCount} votes
          </Text>
        </Box>
        <Star favourite={true} />
      </Box>
      <Box textAlign="center" letterSpacing="wide" p={2}>
        {movie.title}
      </Box>
    </Box>
  );
};

MovieGridElement.displayName = 'MovieGridElement';
export default MovieGridElement;

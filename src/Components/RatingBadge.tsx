import React from 'react';
import { Badge, Box, Text } from '@chakra-ui/react';

interface RatingBadgeProps {
  rating: number;
  voteCount: number;
}

const calculateRatingColor = (rating: number) => `hsla(${rating * 10}, 95%, 63%, 0.9)`;

const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, voteCount }) => {
  return (
    <Box display="flex" alignItems="center">
      <Badge
        borderRadius="full"
        px="2"
        py={1}
        color="white"
        backgroundColor={calculateRatingColor(rating)}
        textShadow="0 0 3px black"
      >
        {rating}
      </Badge>
      <Text pl={2} fontSize="xs">
        {voteCount} votes
      </Text>
    </Box>
  );
};

RatingBadge.displayName = 'RatingBadge';
export default RatingBadge;

// Put vote counts in Rating hover alt text instead?

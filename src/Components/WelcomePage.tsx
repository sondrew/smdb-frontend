import React from 'react';
import {
  Box,
  Center,
  Flex,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';

const WelcomePage: React.FC = () => {
  return (
    <Box>
      <Heading pt={3} mb={6} textAlign="center">
        Create recommendations!
      </Heading>

      <Flex mt={40} justifyContent="center">
        <Box
          w={{
            zero: '95%',
            xxs: '95%',
            xs: '90%',
            sm: '60%',
            md: '30%',
            lg: '25%',
            xl: '20%',
            xxl: '16%',
          }}
          bgColor="grey"
        >
          <Input
            pl={5}
            fontSize={'x-large'}
            variant="flushed"
            size="lg"
            placeholder="Search movie/show"
          />
        </Box>
      </Flex>
    </Box>
  );
};

WelcomePage.displayName = 'WelcomePage';
export default WelcomePage;

import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  // colors: {},
  // fonts: {},
  // fontSizes: {},
  breakpoints: {
    zero: '0px',
    xxxs: '100px',
    xxs: '320px',
    xs: '500px',
    sm: '750px',
    md: '900px',
    lg: '1200x',
    xl: '1600px',
    xxl: '2300px',
    xxxl: '3200px',
  },
});

export default customTheme;

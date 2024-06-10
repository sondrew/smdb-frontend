export const getClientCountryCode = async (): Promise<string | undefined> => {
  return fetch('https://api.country.is/')
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          if (!!data?.country) {
            return data.country;
          } else return undefined;
        });
      }
      return undefined;
    })
    .catch((error) => {
      console.error('Error fetching country code', error);
      return undefined;
    });
};

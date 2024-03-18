# Movie and TV show recommender with streaming provider availability overview
A no-hassle website for creating recommendation lists of movies and TV show to send to your friends. 
When opening a recommendation list, you will see an overview of which streaming providers these are available on (if any). 
Eventually, you will be able to filter the list based on which providers you want.

## Stack
Typescript, React, Firebase (firestore, hosting, callable functions, secrets), Chakra

## Current and coming functionality, and ideas for future development

- Rewrite backend to serverless functions and use firebase in frontend to read content
- Show which streaming service each movie/TV show is available (first for Norway)
- Link each movie/TV show to IMDb
- Adapt streaming services to which country user is visiting from
- Enable filtering/sorting of recommendations based on which streaming services user has 
- Better universal design and navigation through keyboard/screen readers
- Add socials login/signup when creating list to keep track and enable editing after creation
- Show IMDb score on each movie/TV show (depends on API access and free pricing)
- Eventually support multiple countries streaming services


### Technical tasks
- Scroll to focused element on keyboard navigation (esp. in search)
- Handle cases where some items from createList request is not returned in response - i.e. an error in one of the details request happened
- Better Firestore rules, only write using frontend client, only write using backend, only access list of current url
- Loaders when awaiting response?
  - Creating list
  - Checking providers, etc
  - Viewing recommendation list
- Show original title when differing from english one?
- Make poster images same aspect ratio/fit in same box
- Better way to handle if movies/shows are available from provider - or is a request for each media needed?
- Error boundry & handle 404
- Add optional name of submitter
- Show/hide toggle media description
- Create imdb links to shows/movies when viewing list
- Check internet connection - don't load images for all search items (or load in lower resolution) for bad connection. Lower resolution when viewing lists with poor connection
- Show small info box when trying to add duplicate, that item was ignored
- Consider don't showing composite providers that offer other providers as part of their service? E.g. Strim might show as provider for HBO shows
- Automatically or manually let user set tags genre tags or similar for their lists (either deduce by most reoccuring genres or let user decide by suggestions)
- Fix numbering of recommendation list (displays in wrong order after creating list)

## Also store?
- Original language/spoken language?
- Runtime?
- Video?

## Set up for local development (not complete)
- Clone this repo
- Create a local firebase project
- Install Firebase CLI
- Create firebase project
- Set up hosting, firestore and functions (+github actions and secrets)
- Replace firebase config
- `npm install && npm start`
- `cd functions/ && npm install && npm run serve`
- 
- configure api key secret
- 

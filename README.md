# API

I want to build myself an API so I can use it to do things on my future projects.

I want it to be connected to a mongodb so I can store information rapidly and easily.

The next project I want to build is a Telegram Bot.

## To-do

- [ ] POST api/text/*lang*/*text_id*
  - i.e. POST /text/fr/know_more_btn --> saves in the db as { text_id: 'know_more_btn', page: 'PAGE', lang: 'fr', text: 'En savoir plus...'}
- [ ] GET api/text/*lang*/
  - gets all texts where lang = *lang*
  - SELECT * FROM texts WHERE lang = *lang* (not SQL but Mongo)
- [ ] GET api/text/*lang*/*page*
  - get all texts for the specified *page* in the specified *lang*
  - SELECT * FROM texts WHERE lang = *lang* and page = *page* (not SQL but Mongo)
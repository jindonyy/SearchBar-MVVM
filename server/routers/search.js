const server = require('express');
const router = server.Router();
const searchKeywords = require('../data/searchKeywords.json');

router.get('/', (request, response) => {
  try {
    response.json(searchKeywords);
  } catch (err) {
    response.status(500).send(err);
  }
});

module.exports = router;

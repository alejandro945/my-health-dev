var nano = require('nano');

module.exports = nano(process.env.DATABASE_URL);

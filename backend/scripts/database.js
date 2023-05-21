var nano = require('nano');

module.exports = nano(process.env.DATABASE_URL || 'http://admin:password@127.0.0.1:5984');

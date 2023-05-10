var nano = require('nano');

module.exports = nano(process.env.DATABASE_URL || 'http://admin:password@172.190.57.115:5984');

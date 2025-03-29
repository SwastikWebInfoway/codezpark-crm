const db = require('../config/db');

const Request = {
  log: async (method, url, userId) => {
    await db.query('INSERT INTO requests (method, url, userId) VALUES (?, ?, ?)', [method, url, userId]);
  }
};

module.exports = Request;

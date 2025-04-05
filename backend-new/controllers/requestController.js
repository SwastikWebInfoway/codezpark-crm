const Request = require('../models/Request');

const logRequest = async (req, res, next) => {
  await Request.log(req.method, req.url, req.user.id);
  next();
};

module.exports = { logRequest };

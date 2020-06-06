const httpStatus = require("http-status");
const router = require("express").Router({ mergeParams: true });
const basicAuth = require("./../auth/basicAuth");

const getQuoteByUser = require("../services/getQuotes");

router.use(basicAuth);

// [GET] quotes
router.get("/", (req, res) => {
  res.status(httpStatus.OK).json(getQuoteByUser(req));
});

module.exports = router;

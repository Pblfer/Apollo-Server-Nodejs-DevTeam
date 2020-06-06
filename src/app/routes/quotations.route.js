const httpStatus = require("http-status");
const router = require("express").Router({ mergeParams: true });
const basicAuth = require("../auth/basicAuth");

const getQuotations = require("../services/getQuotations");

router.use(basicAuth);

// [GET] quotes
router.get("/", (req, res) => {
  res.status(httpStatus.OK).json(getQuotations(req));
});

module.exports = router;

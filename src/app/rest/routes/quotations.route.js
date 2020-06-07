const httpStatus = require("http-status");
const router = require("express").Router({ mergeParams: true });
const basicAuth = require("@app/rest/auth/basicAuth");

const getQuotations = require("@app/rest/services/getQuotations");

router.use(basicAuth);

// [GET] quotes
router.get("/", (req, res) => {
  res.status(httpStatus.OK).json(getQuotations(req));
});

module.exports = router;

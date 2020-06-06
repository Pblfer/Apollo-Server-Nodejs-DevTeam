const httpStatus = require("http-status");
const router = require("express").Router({ mergeParams: true });
const basicAuth = require("./../auth/basicAuth");

router.use(basicAuth);

// [GET] :id
router.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    hello: "Welcome to quotes",
    version: process.env.npm_package_version,
  });
});

module.exports = router;

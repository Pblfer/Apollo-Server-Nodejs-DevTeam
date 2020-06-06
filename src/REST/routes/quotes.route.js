const httpStatus = require("http-status");
const router = require("express").Router({ mergeParams: true });
const basicAuth = require("./../auth/basicAuth");

router.use(basicAuth);

// [GET] :id
router.get("/", (req, res) => {
  res.status(httpStatus.OK).json({
    data: [
      {
        id: 1,
        header: "User #1",
        link: "https://www.google.com",
        total: {
          code: "USD",
          value: 100.33333,
        },
        date: "2019-10-01T19:20:11+02:00",
      },
    ],
  });
});

module.exports = router;

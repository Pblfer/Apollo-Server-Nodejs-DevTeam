const parseRequest = (query) => {
  const { selectedIds, companyId, resource } = query;

  if (
    !resource &&
    !selectedIds &&
    !companyId &&
    (resource !== "person" || resource !== "deal")
  ) {
    throw new Error("Invalid request");
  }

  console.log(query);

  return {
    resource,
    id: selectedIds,
    companyId,
  };
};

const getQuotes = (filters) => {
  // Fake Data
  return {
    data: [
      {
        id: 1,
        header: "Quote #1",
        link: process.env.FLATTLO_URI + "quotes/1",
        total: {
          code: "USD",
          value: 100.33,
        },
        date: "2019-10-01T19:20:11+02:00",
      },
      {
        id: 2,
        header: "Quote #2",
        link: process.env.FLATTLO_URI + "quotes/2",
        total: {
          code: "USD",
          value: 100.33,
        },
        date: "2019-10-01T19:20:11+02:00",
      },
    ],
  };
};

const getQuoteByUser = (req) => {
  try {
    const filters = parseRequest(req.query);
    return getQuotes(filters);
  } catch {
    return { data: [] };
  }
};

module.exports = getQuoteByUser;

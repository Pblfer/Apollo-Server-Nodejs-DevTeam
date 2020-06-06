const personMockData = require("./mock_data_person.json");
const dealMockData = require("./mock_data_deal.json");

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

  switch (filters.resource) {
    case "person": {
      return {
        data: personMockData,
      };
    }

    case "deal": {
      return {
        data: dealMockData,
      };
    }
  }
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

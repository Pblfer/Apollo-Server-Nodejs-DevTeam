const personMockData = require("./mock_data_person.json");
const dealMockData = require("./mock_data_deal.json");

const validateRequest = (query) => {
  const { selectedIds, companyId, resource } = query;

  if (
    !resource &&
    !selectedIds &&
    !companyId &&
    (resource !== "person" || resource !== "deal")
  ) {
    throw new Error("Invalid request");
  }

  return {
    resource,
    id: selectedIds,
    companyId,
  };
};

const getQuotations = (filters) => {
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

module.exports = (req) => {
  try {
    const filters = validateRequest(req.query);
    return getQuotations(filters);
  } catch {
    return { data: [] };
  }
};

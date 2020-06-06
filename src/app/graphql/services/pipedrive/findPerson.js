const { pipedrive } = require("@infrastructure");

const searchPersons = async (term, organizationId, searchByEmail = false) => {
  const filters = {
    term,
    orgId: organizationId,
    ...(searchByEmail && searchByEmail),
  };

  try {
    const personsResponse = await pipedrive.PersonsController.findPersonsByName(
      filters,
      (error, res) => {
        if (error) {
          return null;
        }
        return res;
      }
    );

    if (personsResponse.success) {
      const persons = personsResponse.data;

      return persons.map((person) => ({
        id: person.id,
        name: person.name,
        email: [
          {
            value: person.email,
          },
        ],
        phone: [
          {
            value: person.phone,
          },
        ],
      }));
    }

    return null;
  } catch (err) {
    throw new Error("Error getting pipedrive data");
  }
};

module.exports = searchPersons;

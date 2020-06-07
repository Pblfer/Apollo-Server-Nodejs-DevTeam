const { pipedrive } = require("@infrastructure");

const addPerson = async (name, email, organizationId = "", phone = "") => {
  const input = {
    body: {
      name,
      email,
      phone,
      org_id: organizationId,
    },
  };

  try {
    const personsResponse = await pipedrive.PersonsController.addAPerson(
      input,
      (error, res) => {
        if (error) {
          return null;
        }
        return res;
      }
    );

    if (personsResponse.success) {
      const person = personsResponse.data;

      return {
        id: person.id,
        name: person.name,
        email: person.email,
        phone: person.phone,
      };
    }

    return null;
  } catch (err) {
    throw new Error("Error getting pipedrive data");
  }
};

module.exports = addPerson;

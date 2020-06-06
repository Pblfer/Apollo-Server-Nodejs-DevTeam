const { pipedrive } = require("../../../infrastructure");

const getDeal = async (dealId) => {
  const response = await pipedrive.DealsController.getDetailsOfADeal(
    dealId,
    (error, res) => {
      if (error) {
        return null;
      }
      return res;
    }
  );

  if (response.success) {
    const deal = response.data;

    return {
      id: deal.id,
      person: deal.person_id && {
        id: deal.person_id.value,
        name: deal.person_id.name,
        email: deal.person_id.email,
        phone: deal.person_id.phone,
      },
      organization: deal.org_id && {
        id: deal.org_id.value,
        name: deal.org_id.name,
      },
    };
  }

  return null;
};

module.exports = getDeal;

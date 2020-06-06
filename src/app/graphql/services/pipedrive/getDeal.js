const { pipedrive } = require("@infrastructure");

const getDeal = async (dealId) => {
  try {
    const dealResponse = await pipedrive.DealsController.getDetailsOfADeal(
      dealId,
      (error, res) => {
        if (error) {
          return null;
        }
        return res;
      }
    );

    if (dealResponse.success) {
      const deal = dealResponse.data;
      const organizationResponse = await pipedrive.OrganizationsController.getDetailsOfAnOrganization(
        deal.org_id.value,
        (error, res) => {
          if (error) {
            return null;
          }
          return res;
        }
      );

      const companyId = organizationResponse.success
        ? organizationResponse.data.company_id
        : null;

      return {
        id: deal.id,
        companyId,
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
  } catch (err) {
    throw new Error("Error getting pipedrive data");
  }
};

module.exports = getDeal;

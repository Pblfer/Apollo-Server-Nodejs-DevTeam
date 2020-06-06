const dealModule = require("./deal.module");
const organizationModule = require("./organization.module");
const personModule = require("./person.module");
const authModule = require("./auth.module");

module.exports = [authModule, dealModule, organizationModule, personModule];

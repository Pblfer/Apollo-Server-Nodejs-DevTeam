const pipedrive = require("pipedrive");

pipedrive.Configuration.apiToken = process.env.PIPEDRIVE_API_TOKEN;

module.exports = pipedrive;

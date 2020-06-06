const { pipedrive } = require("@infrastructure");

const authorize = async (code) => {
  const oAuthManager = pipedrive.OAuthManager;
  try {
    pipedrive.Configuration.oAuthClientId = process.env.PIPEDRIVE_CLIENT_ID;
    pipedrive.Configuration.oAuthClientSecret =
      process.env.PIPEDRIVE_CLIENT_SECRET;
    pipedrive.Configuration.oAuthRedirectUri =
      process.env.PIPEDRIVE_CLIENT_REDIRECT;

    await oAuthManager.authorize(code);
    return true;
  } catch {
    return false;
  }
};

module.exports = authorize;

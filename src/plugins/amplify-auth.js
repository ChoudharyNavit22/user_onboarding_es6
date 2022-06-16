import AmplifyAuth from "../lib/amplifyAuthServices";

exports.register = async function (server, options, next) {
  //Register Authorization Plugin
  server.auth.strategy("AmplifyAuth", "bearer-access-token", {
    allowQueryToken: false,
    allowMultipleHeaders: true,
    accessTokenName: "accessToken",
    validate: async function (request, token, h) {
      let isValid = false;
      let credentials = await AmplifyAuth.validateToken(token);

      if (credentials && credentials["userData"]) {
        isValid = true;
      }
      return { isValid, credentials };
    },
  });
};

exports.name = "amplify-auth-plugin";
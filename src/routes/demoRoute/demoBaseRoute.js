
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Controller from "../../controllers";

const Config = UniversalFunctions.CONFIG;

const demoApi = {
  method: "POST",
  path: "/api/demo/demoApi",
  options: {
    description: "demo api",
    tags: ["api", "demo"],
    handler: function (request, h) {
      var payloadData = request.payload;
      return new Promise((resolve, reject) => {
        Controller.DemoBaseController.demoFunction(payloadData, function (
          err,
          data
        ) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        });
      });
    },
    validate: {
      payload: Joi.object({
        message: Joi.string().required()
      }).label("Demo Model"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const demoAmplifyAuth = {
  method: "POST",
  path: "/api/demo/amplifyAuthApi",
  handler: function (request, h) {
    return new Promise((resolve, reject) => {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      const payloadData = request.payload;
      Controller.DemoBaseController.demoAmplifyAuthFunction(
        userData,
        payloadData,
        function (err, data) {
          if (!err) {
            resolve(UniversalFunctions.sendSuccess(null, data));
          } else {
            reject(UniversalFunctions.sendError(err));
          }
        }
      );
    });
  },
  config: {
    description: "Demo amplify auth",
    tags: ["api", "amplify", "auth"],
    auth: "AmplifyAuth",
    validate: {
      payload: Joi.object({
        message: Joi.string().required(),
      }),
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};

const DemoBaseRoute = [demoApi,demoAmplifyAuth];
export default DemoBaseRoute;

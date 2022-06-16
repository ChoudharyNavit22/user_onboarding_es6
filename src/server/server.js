import ServerHelper from "./helpers";
import SocketManager from "../lib/socketManager";
import SSOManager from "../lib/ssoManager";

/**
 * @author Navit Choudhary
 * @description Initilize HAPI Server
 */
const initServer = async () => {
  //Create Server
  const server = ServerHelper.createServer();

  //Register All Plugins
  await ServerHelper.registerPlugins(server);

  //add views
  ServerHelper.addViews(server);

  //Default Routes
  ServerHelper.setDefaultRoute(server)
  
  SSOManager.createRoute(server);

  // Add routes to Swagger documentation
  ServerHelper.addSwaggerRoutes(server);

  // Bootstrap Application
  ServerHelper.bootstrap();

  SocketManager.connectSocket(server);

  ServerHelper.attachLoggerOnEvents(server);

  // Start Server
  ServerHelper.startServer(server);
}

/**
 * @author Navit Choudhary
 * @description Start HAPI Server
 */
export const startMyServer = () => {

  ServerHelper.configureLog4js();

  ServerHelper.connectMongoDB();

  // Global variable to get app root folder path
  ServerHelper.setGlobalAppRoot();

  process.on("unhandledRejection", err => {
    appLogger.fatal(err);
    process.exit(1);
  });

  initServer();
}

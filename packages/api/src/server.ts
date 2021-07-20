import App from "./app";
import appConfig from "./config/appConfig";

const app = new App(appConfig);

const main = async () => {
  const server = await app.listen();

  function exitHandler(options: any, exitCode: number) {
    if (options.cleanup) {
      server.close();
    }
    if (options.exit) process.exit();
  }

  //do something when app is closing
  process.on("exit", exitHandler.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true, cleanup: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true, cleanup: true }));

  //catches uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error("[Server] Uncaught exception:" + error);
    exitHandler({ exit: true, cleanup: true }, -1);
  });
};

main();

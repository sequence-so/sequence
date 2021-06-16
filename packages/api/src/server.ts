import App from "./app";

let app = new App();

app.getExpressApplication().get("/", (req, res) => res.json({ success: true }));

const server = app
  .getExpressApplication()
  .listen(process.env.PORT, () =>
    console.log(`Sequence API listening on port ${process.env.PORT}`)
  );

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
  console.error(error);
  exitHandler({ exit: true, cleanup: true }, -1);
});

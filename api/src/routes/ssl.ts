import { Application } from "express";

class SSLUpgrade {
  constructor(app: Application) {
    // app.enable("trust proxy");
    // app.use((req, res, next) => {
    //   req.secure
    //     ? next()
    //     : res.redirect("https://" + req.headers.host + req.url);
    // });
  }
}

export default SSLUpgrade;

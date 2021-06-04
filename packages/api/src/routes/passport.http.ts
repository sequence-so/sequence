import { Application } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
require("../auth/google");
require("../auth/jwt");
import JwtConfig from "../config/jwt";

class PassportRoutes {
  constructor(app: Application) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve redirecting
    //   the user to google.com.  After authorization, Google will redirect the user
    //   back to this application at /auth/google/callback
    app.get(
      "/auth/google",
      passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
      })
    );

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get(
      "/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/login/failed" }),
      function (req, res) {
        let token = "";
        jwt.sign(
          {
            user: req.user,
          },
          JwtConfig.jwt.secret,
          JwtConfig.jwt.options,
          (err: any, _token: string) => {
            token = _token;
            if (err) return res.status(500).json(err);

            // Send the Set-Cookie header with the jwt to the client
            res.cookie("jwt", token, JwtConfig.jwt.cookie);
            res.redirect(`${process.env.LOGIN_REDIRECT}?token=${token}`);
          }
        );
      }
    );
  }
}

export default PassportRoutes;

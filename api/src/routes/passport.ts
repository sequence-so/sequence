import { Application } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
require("../auth/google");
require("../auth/jwt");
import JwtConfig from "../auth/jwtConfig";

class PassportRoutes {
  constructor(app: Application) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      console.log(user);
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
      passport.authenticate("google", { failureRedirect: "/login" }),
      function (req, res) {
        let token = "";
        jwt.sign(
          {
            user: req.user,
          },
          process.env.JWT_SECRET_KEY,
          JwtConfig.jwt.options,
          (err, _token) => {
            token = _token;
            if (err) return res.status(500).json(err);

            console.log({ token });
            // Send the Set-Cookie header with the jwt to the client
            res.cookie("jwt", token, JwtConfig.jwt.cookie);
            if (process.env.NODE_ENV === "local") {
              res.redirect(`http://localhost:8000?token=${token}`);
            } else {
              res.redirect(`https://my.sequence.so?token=${token}`);
            }
          }
        );
      }
    );

    app.post("/login", passport.authenticate("local"), (req, res) => {
      console.log(req.user);
      jwt.sign(
        { user: req.user },
        process.env.JWT_SECRET_KEY,
        (err: any, token: string) => {
          if (err) return res.json(err);

          // Send Set-Cookie header
          res.cookie("jwt", token, JwtConfig.jwt.cookie);

          // Return json web token
          return res.json({
            jwt: token,
          });
        }
      );
    });

    app.use(
      "/api/v1",
      passport.authenticate("jwt-cookiecombo", {
        session: false,
      }),
      (req, res, next) => {
        return next();
      }
    );

    app.use(
      "/api/v1/test",
      passport.authenticate("jwt-cookiecombo", {
        session: false,
      }),
      (req, res, next) => {
        return next("yessir");
      }
    );

    app.get(
      "/login",
      passport.authenticate("local", {
        session: false,
        successRedirect: "/",
        failureRedirect: "/login2",
      }),
      (req, res) => {
        // Create and sign json web token with the user as payload
        jwt.sign(
          {
            user: req.user,
          },
          process.env.JWT_SECRET_KEY,
          JwtConfig.jwt.options,
          (err, token) => {
            if (err) return res.status(500).json(err);

            // Send the Set-Cookie header with the jwt to the client
            res.cookie("jwt", token, JwtConfig.jwt.cookie);

            // Response json with the jwt
            return res.json({
              jwt: token,
            });
          }
        );
      }
    );
  }
}

export default PassportRoutes;

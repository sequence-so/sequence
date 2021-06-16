import { Application } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
require("../auth/google");
require("../auth/jwt");
require("../auth/email");
import JwtConfig from "../config/jwt";
import User from "src/models/user.model";

interface SignupBody {
  email: string;
  password: string;
}

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

    if (process.env.ENABLE_GOOGLE_LOGIN) {
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
          jwt.sign(
            {
              user: req.user,
            },
            JwtConfig.jwt.secret,
            JwtConfig.jwt.options,
            (err: any, token: string) => {
              if (err) return res.status(500).json(err);

              // Send the Set-Cookie header with the jwt to the client
              res.cookie("jwt", token, JwtConfig.jwt.cookie);
              res.redirect(`${process.env.LOGIN_REDIRECT}?token=${token}`);
            }
          );
        }
      );
    }

    app.post(
      "/login",
      passport.authenticate("local", { failWithError: true }),
      function (req, res) {
        jwt.sign(
          {
            user: req.user,
          },
          JwtConfig.jwt.secret,
          JwtConfig.jwt.options,
          (err: any, token: string) => {
            if (err) {
              return res.status(500).json(err);
            }

            // Send the Set-Cookie header with the jwt to the client
            res.cookie("jwt", token, JwtConfig.jwt.cookie);
            res.send({
              token,
              url: `${process.env.LOGIN_REDIRECT}?token=${token}`,
            });
          }
        );
      },
      function (err: any, req: any, res: any) {
        // handle error
        if (err) {
          return res.status(err.status).json(err);
        }
        return res.redirect("/login");
      }
    );

    app.post("/signup", async (req, res) => {
      const body = req.body as SignupBody;

      if (!body.email) {
        return res.status(409).send({
          message: "No email provided",
        });
      }
      if (!body.password) {
        return res.status(409).send({
          message: "No password provided",
        });
      }
      if (body.password.length < 8) {
        return res.status(409).send({
          message: "Password must be 8 characters or longer",
        });
      }
      const existing = await User.findOne({
        where: {
          email: body.email,
        },
      });
      if (existing) {
        return res.status(409).send({
          message: "Email is already taken",
        });
      }

      const user = await User.create({
        email: body.email,
        password: body.password,
      });

      jwt.sign(
        {
          user,
        },
        JwtConfig.jwt.secret,
        JwtConfig.jwt.options,
        (err: any, token: string) => {
          if (err) {
            return res.status(500).json(err);
          }

          // Send the Set-Cookie header with the jwt to the client
          res.cookie("jwt", token, JwtConfig.jwt.cookie);
          res.send({
            data: user,
            token,
            url: `${process.env.LOGIN_REDIRECT}?token=${token}`,
          });
        }
      );
    });
  }
}

export default PassportRoutes;

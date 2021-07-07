import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "src/models/user.model";
import { verify } from "src/utils/password";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      session: false,
      passReqToCallback: true,
    },
    async function done(
      req: express.Request,
      username: string,
      password: string,
      done: CallableFunction
    ) {
      const user = await User.findOne({
        attributes: [
          "id",
          "email",
          "password",
          "firstName",
          "lastName",
          "onboardedAt",
        ],
        where: {
          email: username,
        },
      });
      if (!user) {
        return done(null, false, { message: "Invalid credentials provided." });
      }
      if (!user.password) {
        return done(null, false, { message: "Invalid credentials provided." });
      }
      const valid = await verify(password, user.password);
      if (valid) {
        delete user.password;
        return done(null, user);
      }
      return done(null, false, { message: "Invalid credentials provided." });
    }
  )
);

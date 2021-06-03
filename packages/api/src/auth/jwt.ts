import passport from "passport";
// @ts-ignore
import JwtCookieComboStrategy from "passport-jwt-cookiecombo";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";
import JwtConfig from "../config/jwt";

passport.use(
  new JwtCookieComboStrategy(
    {
      secretOrPublicKey: JwtConfig.jwt.secret,
      jwtVerifyOptions: JwtConfig.jwt.options,
      passReqToCallback: false,
    },
    (payload: any, done: CallableFunction) => {
      return done(null, payload.user, {});
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      session: false,
    },
    async (username: string, password: string, done: CallableFunction) => {
      const user = await User.findOne({
        where: {
          email: username,
        },
      });
      if (user) {
        return done(null, user);
      }
      return done(new Error("No user found"));
    }
  )
);

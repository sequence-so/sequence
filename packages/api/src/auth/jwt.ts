import passport from "passport";
// @ts-ignore
import JwtCookieComboStrategy from "passport-jwt-cookiecombo";
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

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";
import { verify } from "src/utils/password";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      session: false,
    },
    async (username: string, password: string, done: CallableFunction) => {
      const user = await User.findOne({
        attributes: ["id", "email", "password", "firstName", "lastName"],
        where: {
          email: username,
        },
      });
      if (!user) {
        return done(new Error("An error occured logging you in"));
      }
      console.log(user);

      const valid = await verify(password, user.password);
      if (valid) {
        delete user.password;
        return done(null, user);
      }
      return done(new Error("An error occured logging you in"));
    }
  )
);

import passport from "passport";
import JwtCookieComboStrategy from "passport-jwt-cookiecombo";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user";

passport.use(
  new JwtCookieComboStrategy(
    {
      secretOrPublicKey: process.env.JWT_SECRET_KEY,
    },
    (payload: any, done: CallableFunction) => {
      return done(null, payload.user);
    }
  )
);

// passport.use(
//   new LocalStrategy(
//     {
//       // My users have only email
//       usernameField: "email",
//       session: false,
//     },
//     (username: string, password: string, done: CallableFunction) => {
//       User.findOne({
//         email: username,
//       })
//         // Explicitly select the password when the model hides it
//         .select("password role")
//         .exec((err, user) => {
//           if (err) return done(err);

//           // Copy the user w/o the password into a new object
//           if (user && user.verifyPassword(password))
//             return done(null, {
//               id: user._id,
//               role: user.role,
//             });

//           return done(null, false);
//         });
//     }
//   )
// );

var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
import AuthGoogle from "../models/auth_google";
import User from "../models/user";

interface GoogleProfile {
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: [{ value: string; verified: boolean }];
  photos: [{ value: string }];
}
// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CONSUMER_KEY,
      clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: CallableFunction
    ) {
      console.log({ accessToken, refreshToken, profile });
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const photo = profile.photos ? profile.photos[0].value : null;
      const email = profile.emails ? profile.emails[0].value : null;

      let authGoogle = await AuthGoogle.findOne({
        where: {
          googleId: profile.id,
        },
      });
      console.log({ authGoogle });
      if (!authGoogle) {
        const user = await User.create({
          firstName,
          lastName,
          email,
          photo,
        });
        await AuthGoogle.create({
          googleId: profile.id,
          accessToken: accessToken,
          userId: user.id,
          email,
          photo,
        });
        done(null, user);
      } else {
        const user = await User.findOne({
          where: {
            email,
          },
        });
        console.log({ user });
        done(null, user);
      }
    }
  )
);

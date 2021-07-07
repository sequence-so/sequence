import passport from "passport";
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
import AuthGoogle from "src/models/auth_google";
import User from "src/models/user.model";
import Organization from "src/models/organization";

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
if (process.env.ENABLE_GOOGLE_LOGIN) {
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
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;
        const photo = profile.photos ? profile.photos[0].value : null;
        const email = profile.emails ? profile.emails[0].value : null;

        const authGoogle = await AuthGoogle.findOne({
          where: {
            googleId: profile.id,
          },
        });

        if (!authGoogle) {
          const user = await User.create({
            firstName,
            lastName,
            email,
            photo,
          });
          await Organization.create({
            name: "",
            photo: "",
            ownerId: user.id,
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
          done(null, user);
        }
      }
    )
  );
}

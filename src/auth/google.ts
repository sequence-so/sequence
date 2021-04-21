var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

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
    function (
      token: string,
      tokenSecret: string,
      profile: any,
      done: CallableFunction
    ) {
      console.log({ token, tokenSecret });
      // User.findOrCreate({ googleId: profile.id }, function (err: any, user: any) {
      //   return done(err, user);
      // });
    }
  )
);

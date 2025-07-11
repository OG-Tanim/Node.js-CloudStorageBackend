import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../../../models/User';
import { env } from '../../../config/env';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId!,
      clientSecret: env.googleClientSecret!,
      callbackURL: env.googleCallbackUrl!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) return done(null, existingUser);

        const user = await User.create({
          username: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
        });

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

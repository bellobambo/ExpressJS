import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { DiscordUser } from '../mongoose/schema/discord-user.mjs';


passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`)
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await DiscordUser.findById(id);
        return findUser ? done(null, findUser) : done(null, null);
    } catch (error) {
        done(error, null)
        console.log(error)
    }
})

passport.use(
    new DiscordStrategy({
        clientID: '1233317385339932752',
        clientSecret: 'ENpW4-qJwCjfVcsu-Ob9bN51QxNet37j',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ['identify'],
    },
        async (accessToken, refreshToken, profile, done) => {
            let findUser;
            try {
                findUser = await DiscordUser.findOne({ discordId: profile.id });

            } catch (error) {
                console.error(error);
                return done(error, null);
            }

            try {
                if (!findUser) {
                    const newUser = new DiscordUser({
                        username: profile.username,
                        discordId: profile.id,
                    });
                    const newSavedUser = await newUser.save();
                    return done(null, newSavedUser);
                }
                return done(null, findUser);

            } catch (error) {
                console.log(error);
                return done(err, null);
            }
        })
);



// CLIENT_SECRET = ENpW4-qJwCjfVcsu-Ob9bN51QxNet37j
// CLIENT_ID = 1233317385339932752

// REDIRECT = http://localhost:3000/discord/redirect
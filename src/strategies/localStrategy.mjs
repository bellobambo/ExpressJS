import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`)
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    console.log(`Inside Deserialize User`)
    console.log(`Deserializing User ID: ${id}`)
    try {
        const findUser = mockUsers.find((user) => user.id === id);
        if (!findUser) throw new Error('User Not Found');
        done(null, findUser);
    } catch (error) {
        done(err, null)
    }
})

export default passport.use(
    new Strategy((username, password, done) => {
        console.log(`username, ${username}`)
        console.log(`password, ${password}`)
        try {
            const findUser = mockUsers.find(
                (user) => user.username === username
            );
            if (!findUser) {
                return done(null, false, { message: 'user not found' });
            }
            if (findUser.password !== password) {
                return done(null, false, { message: 'password mismatch' });
            }
            return done(null, findUser);
        } catch (error) {
            done(error, null);
        }
    })
);

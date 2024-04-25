import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schema/user.mjs";
import { comparedPassword } from "../utils/helper.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`)
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    console.log(`Inside Deserialize User`)
    console.log(`Deserializing User ID: ${id}`)
    try {
        const findUser = await User.findById(id)
        if (!findUser) throw new Error('User Not Found');
        done(null, findUser);
    } catch (error) {
        done(err, null)
    }
})


export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ username });
            if (!findUser) throw new Error('User Not found');
            if (!comparedPassword(password, findUser.password))
                throw new Error('User Credentials');
            done(null, findUser);
        } catch (error) {
            done(error, null);
        }
    })
);

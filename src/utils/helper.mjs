import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashpassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw error; 
    }
};

export const comparedPassword =(plain, hashed)=>  bcrypt.compareSync(plain, hashed )

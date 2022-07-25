import bcrypt from "bcryptjs";

export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(8);
    return await bcrypt.hash(password, salt);
  };
  
export const matchPassword = async function (password, password_db) {
    return await bcrypt.compare(password, password_db);
  };